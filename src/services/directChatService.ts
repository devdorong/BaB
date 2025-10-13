/**
 * 1 : 1 채팅 서비스 (Supabase 연동 버전)
 *  - 실제 Supabase API를 사용한 채팅 서비스
 *  - 데이터베이스 연동을 통한 실시간 채팅 기능
 *
 * 주요기능
 *  - 채팅방 생성 및 조회
 *  - 메시지 전송 및 조회
 *  - 사용자 검색
 *  - 실시간 메시지 동기화
 *
 * Supabase 테이블 구조
 *  - direct_chats: 1:1 채팅방 정보
 *  - direct_messages: 메시지 정보
 *  - auth.users: 사용자 인증 정보
 */

import { supabase } from '../lib/supabase';
import type {
  ChatApiResponse,
  ChatListItem,
  ChatUser,
  CreateMessageData,
  DirectChat,
  DirectMessage,
} from '../types/chatType';

/**
 * 현재 사용자 정보 가져오기
 */
async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('사용자가 로그인되지 않았습니다.');
  }
  return user;
}

/**
 * 1 : 1 채팅방 생성 또는 찾기
 * - 사용자가 특정 사용자와 채팅을 시작하려고 할 때 호출
 * - 기존 채팅방이 있으면 재사용, 없으면 새로 생성함.
 * - 중복 채팅방이 생성되지 않도록
 *
 * @param participantId - 채팅방에 참여할 상대방 ID
 */
export async function findOrCreateDirectChat(
  participantId: string,
): Promise<ChatApiResponse<DirectChat>> {
  try {
    const currentUser = await getCurrentUser();

    // 1단계: 기존 채팅방 찾기
    const { data: existingChats, error: findError } = await supabase
      .from('direct_chats')
      .select('*')
      .or(
        `and(user1_id.eq.${currentUser.id},user2_id.eq.${participantId}),and(user1_id.eq.${participantId},user2_id.eq.${currentUser.id})`,
      )
      .limit(1);

    if (findError) {
      console.error('채팅방 검색 오류:', findError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    if (existingChats && existingChats.length > 0) {
      // 기존 채팅방 발견
      return { success: true, data: existingChats[0] };
    }

    // 2단계: 새 채팅방 생성
    const { data: newChat, error: createError } = await supabase
      .from('direct_chats')
      .insert({
        user1_id: currentUser.id,
        user2_id: participantId,
      })
      .select()
      .single();

    if (createError) {
      // 중복 에러인 경우 기존 채팅방 다시 찾기
      if (createError.code === '23505') {
        const { data: existingChat } = await supabase
          .from('direct_chats')
          .select('*')
          .or(
            `and(user1_id.eq.${currentUser.id},user2_id.eq.${participantId}),and(user1_id.eq.${participantId},user2_id.eq.${currentUser.id})`,
          )
          .single();

        return { success: true, data: existingChat };
      }

      console.error('채팅방 생성 오류:', createError);
      return { success: false, error: '채팅방을 생성할 수 없습니다.' };
    }

    return { success: true, data: newChat };
  } catch (error) {
    console.error('findOrCreateDirectChat 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 채팅방 목록 조회
 */
export async function getChatList(): Promise<ChatApiResponse<ChatListItem[]>> {
  try {
    const currentUser = await getCurrentUser();

    // 사용자의 채팅방 목록 조회 (최신 메시지 순)
    const { data: chats, error: chatsError } = await supabase
      .from('direct_chats')
      .select('*')
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
      .order('last_message_at', { ascending: false });

    if (chatsError) {
      console.error('채팅방 목록 조회 오류:', chatsError);
      return { success: false, error: '채팅방 목록을 불러올 수 없습니다.' };
    }

    if (!chats || chats.length === 0) {
      return { success: true, data: [] };
    }

    // 각 채팅방의 마지막 메시지와 읽지 않은 메시지 수 조회
    const chatListItems: ChatListItem[] = await Promise.all(
      chats.map(async chat => {
        // 상대방 사용자 ID
        const otherUserId = chat.user1_id === currentUser.id ? chat.user2_id : chat.user1_id;

        // 상대방 사용자 정보 조회 (profiles 테이블에서)
        let otherUserInfo: ChatUser;
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, nickname, avatar_url')
            .eq('id', otherUserId)
            .single();

          if (profileError || !profileData) {
            // 조회 실패 시 기본값 사용
            otherUserInfo = {
              id: otherUserId,
              email: `user-${otherUserId}@example.com`,
              nickname: `User ${otherUserId.slice(0, 8)}`,
              avatar_url: null,
            };
          } else {
            // 실제 사용자 정보 사용
            otherUserInfo = {
              id: profileData.id,
              email: `user-${profileData.id}@example.com`,
              nickname: profileData.nickname,
              avatar_url: profileData.avatar_url,
            };
          }
        } catch (error) {
          // 오류 시 기본값 사용
          otherUserInfo = {
            id: otherUserId,
            email: `user-${otherUserId}@example.com`,
            nickname: `User ${otherUserId.slice(0, 8)}`,
            avatar_url: null,
          };
        }

        // 마지막 메시지 조회 (재활성화)
        let lastMessage = null;
        try {
          const { data: lastMessageData, error: lastMessageError } = await supabase
            .from('direct_messages')
            .select('content, created_at, sender_id')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!lastMessageError && lastMessageData) {
            lastMessage = lastMessageData;
          }
        } catch (error) {
          // 오류 시 null 유지
        }

        // 읽지 않은 메시지 수 조회 (수정: 상대방이 보낸 메시지 중에서 내가 읽지 않은 메시지)
        let unreadCount = 0;
        try {
          const { count, error: unreadCountError } = await supabase
            .from('direct_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chat.id)
            .eq('is_read', false)
            .neq('sender_id', currentUser.id); // 상대방이 보낸 메시지만

          if (!unreadCountError && count !== null) {
            unreadCount = count;
          }
        } catch (error) {
          // 오류 시 0 유지
        }

        return {
          id: chat.id,
          other_user: otherUserInfo,
          last_message: lastMessage
            ? {
                content: lastMessage.content,
                created_at: lastMessage.created_at,
                sender_nickname:
                  lastMessage.sender_id === currentUser.id ? '나' : otherUserInfo.nickname,
              }
            : undefined,
          unread_count: unreadCount || 0,
        };
      }),
    );

    return { success: true, data: chatListItems };
  } catch (error) {
    console.error('getChatList 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 메세지 전송
 *
 * @param messageData - 전송할 메시지 데이터
 */
export async function sendMessage(
  messageData: CreateMessageData,
): Promise<ChatApiResponse<DirectMessage>> {
  try {
    const currentUser = await getCurrentUser();

    // 0단계: 채팅방 존재 여부 확인
    const { data: chat, error: chatError } = await supabase
      .from('direct_chats')
      .select('id')
      .eq('id', messageData.chat_id)
      .single();

    if (chatError || !chat) {
      console.error('채팅방 조회 오류:', chatError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    // 1단계: 메시지 저장
    const { data: newMessage, error: messageError } = await supabase
      .from('direct_messages')
      .insert({
        chat_id: messageData.chat_id,
        sender_id: currentUser.id,
        content: messageData.content,
        is_read: false,
      })
      .select()
      .single();

    if (messageError) {
      console.error('메시지 전송 오류:', messageError);
      console.error('오류 코드:', messageError.code);
      console.error('오류 메시지:', messageError.message);
      console.error('오류 세부사항:', messageError.details);
      console.error('오류 힌트:', messageError.hint);
      return { success: false, error: `메시지를 전송할 수 없습니다: ${messageError.message}` };
    }

    // 2단계: 채팅방의 마지막 메시지 시간 업데이트
    const { error: updateError } = await supabase
      .from('direct_chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', messageData.chat_id);

    if (updateError) {
      console.error('채팅방 업데이트 오류:', updateError);
      // 메시지는 전송되었으므로 성공으로 처리
    }

    return { success: true, data: newMessage };
  } catch (error) {
    console.error('sendMessage 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 메시지 목록 조회
 *
 * @param chatId - 채팅방의 ID
 */
export async function getMessages(chatId: string): Promise<ChatApiResponse<DirectMessage[]>> {
  try {
    const currentUser = await getCurrentUser();

    // 특정 채팅방의 메시지 목록 조회 (시간순)
    // direct_messages 테이블에서 메시지 조회 시도
    const { data: messages, error: messagesError } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('메시지 목록 조회 오류:', messagesError);
      // 권한 문제인 경우 빈 배열 반환
      if (messagesError.code === 'PGRST301' || messagesError.message.includes('permission')) {
        return { success: true, data: [] };
      }
      return {
        success: false,
        error: `메시지를 불러올 수 없습니다: ${messagesError.message}`,
      };
    }

    if (!messages || messages.length === 0) {
      return { success: true, data: [] };
    }

    // 상대방이 보낸 메시지를 읽음 처리 (is_read = true로 업데이트)
    try {
      const { error: updateError } = await supabase
        .from('direct_messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('chat_id', chatId)
        .eq('is_read', false)
        .neq('sender_id', currentUser.id); // 상대방이 보낸 메시지만

      if (updateError) {
        // 오류가 있어도 메시지 조회는 계속 진행
      } else {
      }
    } catch (error) {
      // 오류가 있어도 메시지 조회는 계속 진행
    }

    // 메시지 데이터를 DirectMessage 형태로 변환
    const messageDetails: DirectMessage[] = messages.map(message => ({
      id: message.id,
      chat_id: message.chat_id,
      sender_id: message.sender_id,
      content: message.content,
      is_read: message.is_read,
      read_at: message.read_at,
      created_at: message.created_at,
      sender: {
        id: message.sender_id,
        email: `user-${message.sender_id}@example.com`,
        nickname:
          message.sender_id === currentUser.id ? '나' : `User ${message.sender_id.slice(0, 8)}`,
        avatar_url: null,
      },
    }));

    return { success: true, data: messageDetails };
  } catch (error) {
    console.error('getMessages 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 사용자 검색
 * - 대화 상대방 찾기
 *
 * @param searchTerm - 검색할 닉네임 또는 이메일
 */
export async function searchUsers(searchTerm: string): Promise<ChatApiResponse<ChatUser[]>> {
  try {
    if (!searchTerm.trim()) {
      return { success: true, data: [] };
    }

    // 사용자 검색 (profiles 테이블에서 검색)

    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .ilike('nickname', `%${searchTerm}%`)
      .limit(10);

    if (searchError) {
      console.error('사용자 검색 오류:', searchError);
      return {
        success: false,
        error: `사용자 검색 중 오류가 발생했습니다: ${searchError.message}`,
      };
    }

    if (!profiles || profiles.length === 0) {
      return { success: true, data: [] };
    }

    // 사용자 데이터를 ChatUser 형태로 변환
    const chatUsers: ChatUser[] = profiles.map(profile => ({
      id: profile.id,
      email: `user-${profile.id}@example.com`, // email 필드가 없으므로 기본값 사용
      nickname: profile.nickname,
      avatar_url: profile.avatar_url,
    }));

    return { success: true, data: chatUsers };
  } catch (error) {
    console.error('searchUsers 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

/**
 * 1:1 채팅방 나가기
 * - 사용자가 특정 채팅방에서 나갈 때 호출
 * - 채팅방을 완전히 삭제하는 것이 아니라 논리적 삭제 처리
 * - 현재는 채팅방을 완전히 삭제 (향후 논리적 삭제로 변경 가능)
 *
 * @param chatId - 나갈 채팅방 ID
 */
export async function exitDirectChat(chatId: string): Promise<ChatApiResponse<boolean>> {
  try {
    const currentUser = await getCurrentUser();

    // 1단계: 채팅방 소유권 확인
    const { data: chat, error: chatError } = await supabase
      .from('direct_chats')
      .select('*')
      .eq('id', chatId)
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
      .single();

    if (chatError || !chat) {
      console.error('채팅방 조회 오류:', chatError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    // 2단계: 채팅방 삭제 (향후 논리적 삭제로 변경 가능)
    const { error: deleteError } = await supabase.from('direct_chats').delete().eq('id', chatId);

    if (deleteError) {
      console.error('채팅방 삭제 오류:', deleteError);
      return { success: false, error: '채팅방 나가기에 실패했습니다.' };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('exitDirectChat 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
