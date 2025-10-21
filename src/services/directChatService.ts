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

    // 1단계: 기존 채팅방 찾기 (활성/비활성 포함)
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
      const existingChat = existingChats[0];
      // 비활성화된 채팅방이면 다시 활성화 함
      const isCurrentUserUser1 = existingChat.user1_id === currentUser.id;
      const isCurrentUserActive = isCurrentUserUser1
        ? existingChat.user1_active
        : existingChat.user2_active;

      if (!isCurrentUserActive) {
        // 사용자가 다시 들어올 때 나간 시점 초기화
        const updateData = isCurrentUserUser1
          ? { user1_active: true, user1_left_at: null }
          : { user2_active: true, user2_left_at: null };

        const { data: reactivatedChat, error: reactivateError } = await supabase
          .from('direct_chats')
          .update(updateData)
          .eq('id', existingChat.id)
          .select()
          .single();

        if (reactivateError) {
          // console.error(reactivateError);
          return { success: false, error: '채팅방 재활성화 불가능' };
        }
        return { success: true, data: reactivatedChat };
      }
      // 활성화된 채팅방
      return { success: true, data: existingChat };
    }

    // 2단계: 새 채팅방 생성 (상대방에게 알림 설정)
    const { data: newChat, error: createError } = await supabase
      .from('direct_chats')
      .insert({
        user1_id: currentUser.id,
        user2_id: participantId,
        user1_active: true,
        user2_active: true,
        user1_notified: false, // 생성자는 알림 불필요
        user2_notified: true, // 상대방에게 새 채팅방 알림
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

        // 기존 채팅방이 비활성화되어 있다면 활성화
        if (existingChat) {
          const isCurrentUserUser1 = existingChat.user1_id === currentUser.id;
          const isCurrentUserActive = isCurrentUserUser1
            ? existingChat.user1_active
            : existingChat.user2_active;

          if (!isCurrentUserActive) {
            const updateData = isCurrentUserUser1 ? { user1_active: true } : { user2_active: true };

            const { data: reactivatedChat } = await supabase
              .from('direct_chats')
              .update(updateData)
              .eq('id', existingChat.id)
              .select()
              .single();
            return { success: true, data: reactivatedChat || existingChat };
          }
        }

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

    // 사용자의 활성화 된 채팅방 목록 조회 (최신 메시지 순)
    const { data: chats, error: chatsError } = await supabase
      .from('direct_chats')
      .select(
        `
    id,
    user1_id,
    user2_id,
    user1_active,
    user2_active,
    user1_notified,
    user2_notified,
    last_message_at,
    user1:profiles!direct_chats_user1_id_fkey(id, nickname, avatar_url),
    user2:profiles!direct_chats_user2_id_fkey(id, nickname, avatar_url)
  `,
      )
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
            .limit(1);

          if (!lastMessageError && lastMessageData && lastMessageData.length > 0) {
            lastMessage = lastMessageData[0];
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
          unreadCount = 0;
        }
        // 새 채팅방 알림 상태 확인
        const isCurrentUserUser1 = chat.user1_id === currentUser.id;
        const isNewChat = isCurrentUserUser1 ? chat.user1_notified : chat.user2_notified;

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
          is_new_chat: isNewChat || false,
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
      .select('id, user1_id, user2_id, user1_active, user2_active, user1_notified, user2_notified')
      .eq('id', messageData.chat_id)
      .single();

    if (chatError || !chat) {
      console.error('채팅방 조회 오류:', chatError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    // 상대방의 active 상태를 true로 변경하고 알림 설정 (메시지를 보내면 상대방에게도 채팅방이 표시되어야 함)
    const isCurrentUserUser1 = chat.user1_id === currentUser.id;
    const otherUserActiveField = isCurrentUserUser1 ? 'user2_active' : 'user1_active';
    const otherUserNotifiedField = isCurrentUserUser1 ? 'user2_notified' : 'user1_notified';

    // 상대방이 나간 상태에서 메시지를 받으면 알림 설정
    if (!chat[otherUserActiveField]) {
      console.log('상대방의 채팅방 참여 상태를 활성화하고 알림을 설정합니다.');
      const updateData = {
        [otherUserActiveField]: true,
        [otherUserNotifiedField]: true, // 새 메시지 알림 설정
      };

      const { error: activateError } = await supabase
        .from('direct_chats')
        .update(updateData)
        .eq('id', messageData.chat_id);

      if (activateError) {
        console.error('상대방 활성화 및 알림 설정 오류:', activateError);
        // 오류가 있어도 메시지 전송은 계속 진행
      }
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

    // ============================ 추가부문 ===============================
    try {
      const receiverId = chat.user1_id === currentUser.id ? chat.user2_id : chat.user1_id;

      const { error: notificationError } = await supabase.from('notifications').insert({
        profile_id: currentUser.id, // 보낸 사람
        receiver_id: receiverId, // 받는 사람
        title: '새로운 메시지가 도착했습니다 💬',
        content: messageData.content.slice(0, 50),
        target: ['all', 'profile'], // or 'partner' (상황에 맞게)
        type: '채팅',
      });

      if (notificationError) {
        console.error('채팅 알림 생성 실패:', notificationError.message);
      }
    } catch (err) {
      console.error('알림 생성 중 오류:', err);
    }

    // ============================ 추가부문 끝 ========================

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

    // 0단계: 채팅방 정보 조회 (사용자가 나간 시점 확인)
    const { data: chatInfo, error: chatError } = await supabase
      .from('direct_chats')
      .select('user1_id, user2_id, user1_left_at, user2_left_at')
      .eq('id', chatId)
      .single();

    if (chatError || !chatInfo) {
      console.error('채팅방 정보 조회 오류:', chatError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    // 현재 사용자가 나간 시점 확인
    const isCurrentUserUser1 = chatInfo.user1_id === currentUser.id;
    const userLeftAt = isCurrentUserUser1 ? chatInfo.user1_left_at : chatInfo.user2_left_at;

    // 1단계: 메시지 목록 조회 (사용자가 나간 시점 이후의 메시지만)
    let query = supabase
      .from('direct_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true }); // 오래된 순으로 정렬

    // 사용자가 나간 시점이 있으면 그 이후의 메시지만 조회
    if (userLeftAt) {
      query = query.gte('created_at', userLeftAt);
      console.log('사용자가 나간 시점 이후의 메시지만 조회:', userLeftAt);
    }

    const { data: messages, error: messagesError } = await query;

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
    const messageDetails: DirectMessage[] = await Promise.all(
      messages.map(async message => {
        // 발신자 정보 조회
        let senderInfo: ChatUser;
        if (message.sender_id === currentUser.id) {
          // 현재 사용자 정보 - profiles 테이블에서 조회
          try {
            const { data: currentUserProfile, error: currentUserProfileError } = await supabase
              .from('profiles')
              .select('id, nickname, avatar_url')
              .eq('id', currentUser.id)
              .single();

            if (currentUserProfileError || !currentUserProfile) {
              // profiles 테이블에 없으면 user_metadata 사용
              senderInfo = {
                id: currentUser.id,
                email: currentUser.email || `user-${currentUser.id}@example.com`,
                nickname: '나',
                avatar_url: currentUser.user_metadata?.avatar_url || null,
              };
            } else {
              // profiles 테이블에서 조회 성공
              senderInfo = {
                id: currentUserProfile.id,
                email: currentUser.email || `user-${currentUser.id}@example.com`,
                nickname: '나',
                avatar_url: currentUserProfile.avatar_url,
              };
            }
          } catch (error) {
            senderInfo = {
              id: currentUser.id,
              email: currentUser.email || `user-${currentUser.id}@example.com`,
              nickname: '나',
              avatar_url: currentUser.user_metadata?.avatar_url || null,
            };
          }
        } else {
          // 상대방 사용자 정보 조회
          try {
            // console.log('상대방 사용자 정보 조회 시작:', message.sender_id);
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, nickname, avatar_url')
              .eq('id', message.sender_id)
              .single();

            // console.log('상대방 사용자 정보 조회 결과:', {
            //   profileData,
            //   profileError,
            //   sender_id: message.sender_id,
            // });

            if (profileError || !profileData) {
              // console.log('상대방 사용자 정보 조회 실패, 기본값 사용:', profileError);
              senderInfo = {
                id: message.sender_id,
                email: `user-${message.sender_id}@example.com`,
                nickname: `User ${message.sender_id.slice(0, 8)}`,
                avatar_url: null,
              };
            } else {
              // console.log('상대방 사용자 정보 조회 성공:', profileData);
              senderInfo = {
                id: profileData.id,
                email: `user-${profileData.id}@example.com`,
                nickname: profileData.nickname,
                avatar_url: profileData.avatar_url,
              };
              // console.log('senderInfo 할당 완료:', senderInfo);
            }
          } catch (error) {
            console.log('상대방 사용자 정보 조회 중 예외 발생:', error);
            senderInfo = {
              id: message.sender_id,
              email: `user-${message.sender_id}@example.com`,
              nickname: `User ${message.sender_id.slice(0, 8)}`,
              avatar_url: null,
            };
          }
        }

        return {
          id: message.id,
          chat_id: message.chat_id,
          sender_id: message.sender_id,
          content: message.content,
          is_read: message.is_read,
          read_at: message.read_at,
          created_at: message.created_at,
          is_system_message: message.is_system_message || false,
          sender: senderInfo,
        };
      }),
    );
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

    // 현재 사용자 정보 가져오기
    const currentUser = await getCurrentUser();

    // 현재 사용자와 이미 채팅 중인 사용자들 조회
    const { data: existingChats, error: chatError } = await supabase
      .from('direct_chats')
      .select('user1_id, user2_id')
      .or(
        `and(user1_id.eq.${currentUser.id},user1_active.eq.true),and(user2_id.eq.${currentUser.id},user2_active.eq.true)`,
      );

    if (chatError) {
      console.error('기존 채팅방 조회 오류:', chatError);
      // 오류가 있어도 검색은 계속 진행
    }

    // 이미 채팅 중인 사용자 ID 목록 생성
    const existingUserIds = new Set<string>();
    if (existingChats) {
      existingChats.forEach(chat => {
        if (chat.user1_id === currentUser.id) {
          existingUserIds.add(chat.user2_id);
        } else {
          existingUserIds.add(chat.user1_id);
        }
      });
    }

    console.log('이미 채팅 중인 사용자들:', Array.from(existingUserIds));

    // 사용자 검색 (profiles 테이블에서 검색, 현재 사용자와 이미 채팅중인 사용자 제외)

    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .ilike('nickname', `%${searchTerm}%`)
      .neq('id', currentUser.id) // 현재 사용자 제외
      .limit(20); // 더 많은 결과를 가져온 후 필터링

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

    // 이미 채팅 중인 사용자들을 제외하고 필터링
    const filteredProfiles = profiles.filter(profile => !existingUserIds.has(profile.id));

    console.log('검색된 사용자 수:', profiles.length);
    console.log('필터링 후 사용자 수:', filteredProfiles.length);

    // 사용자 데이터를 ChatUser 형태로 변환 (최대 10명)
    const chatUsers: ChatUser[] = filteredProfiles.slice(0, 10).map(profile => ({
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
 * 비활성화된 채팅방 목록 조회 (나간 채팅방 복구용)
 * - 사용자가 나간 채팅방들을 조회하여 복구할 수 있도록 함
 */
/**
 * 채팅방 입장 시 새 채팅방 알림 해제
 */
export async function clearNewChatNotification(chatId: string): Promise<ChatApiResponse<boolean>> {
  try {
    const currentUser = await getCurrentUser();

    // 채팅방 정보 조회
    const { data: chat, error: chatError } = await supabase
      .from('direct_chats')
      .select('user1_id, user2_id')
      .eq('id', chatId)
      .single();

    if (chatError || !chat) {
      console.error('채팅방 조회 오류:', chatError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    // 현재 사용자의 알림 상태 해제
    const isCurrentUserUser1 = chat.user1_id === currentUser.id;
    const updateData = isCurrentUserUser1 ? { user1_notified: false } : { user2_notified: false };

    const { error: updateError } = await supabase
      .from('direct_chats')
      .update(updateData)
      .eq('id', chatId);

    if (updateError) {
      console.error('알림 해제 오류:', updateError);
      return { success: false, error: '알림을 해제할 수 없습니다.' };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('clearNewChatNotification 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

export async function getInactiveChatList(): Promise<ChatApiResponse<ChatListItem[]>> {
  try {
    const currentUser = await getCurrentUser();

    // 사용자의 비활성화된 채팅방 목록 조회
    // 현재 사용자만 나간 채팅방만 조회 (상대방은 아직 참여 중인 채팅방)
    const { data: chats, error: chatsError } = await supabase
      .from('direct_chats')
      .select('*')
      .or(
        `and(user1_id.eq.${currentUser.id},user1_active.eq.false),and(user2_id.eq.${currentUser.id},user2_active.eq.false)`,
      )
      .order('last_message_at', { ascending: false });

    if (chatsError) {
      console.error('비활성화된 채팅방 목록 조회 오류:', chatsError);
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
          console.error('사용자 정보 조회 오류:', error);
          otherUserInfo = {
            id: otherUserId,
            email: `user-${otherUserId}@example.com`,
            nickname: `User ${otherUserId.slice(0, 8)}`,
            avatar_url: null,
          };
        }

        // 마지막 메시지 조회
        const { data: lastMessage } = await supabase
          .from('direct_messages')
          .select('*')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // 읽지 않은 메시지 수 조회
        const { count: unreadCount } = await supabase
          .from('direct_messages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_id', chat.id)
          .eq('sender_id', otherUserId)
          .eq('is_read', false);

        return {
          id: chat.id,
          other_user: otherUserInfo,
          last_message: lastMessage || null,
          unread_count: unreadCount || 0,
          last_message_at: chat.last_message_at,
        };
      }),
    );

    return { success: true, data: chatListItems };
  } catch (error) {
    console.error('getInactiveChatList 오류:', error);
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
      .single();

    // 사용자가 채팅방에 참여했는지 확인
    if (chat && chat.user1_id !== currentUser.id && chat.user2_id !== currentUser.id) {
      return { success: false, error: '채팅방에 접근할 수 없습니다.' };
    }

    if (chatError || !chat) {
      console.error('채팅방 조회 오류:', chatError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    // 2단계: 상대방에게 시스템 메시지 전송
    const isCurrentUserUser1 = chat.user1_id === currentUser.id;
    const otherUserId = isCurrentUserUser1 ? chat.user2_id : chat.user1_id;

    // 현재 사용자의 닉네임 조회
    let currentUserNickname = '사용자';
    try {
      const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', currentUser.id)
        .single();

      if (currentUserProfile?.nickname) {
        currentUserNickname = currentUserProfile.nickname;
      }
    } catch (error) {
      console.log('현재 사용자 닉네임 조회 실패, 기본값 사용:', error);
    }

    const systemMessage = `${currentUserNickname}님이 채팅방을 나갔습니다.`;

    console.log('시스템 메시지 전송 시작:', {
      chat_id: chatId,
      sender_id: currentUser.id,
      content: systemMessage,
      is_system_message: true,
      otherUserId: otherUserId,
      currentUserNickname: currentUserNickname,
    });

    const { data: systemMessageData, error: systemMessageError } = await supabase
      .from('direct_messages')
      .insert({
        chat_id: chatId,
        sender_id: currentUser.id,
        content: systemMessage,
        is_read: false,
        is_system_message: true, // 시스템 메시지 표시
      })
      .select()
      .single();

    if (systemMessageError) {
      console.error('시스템 메시지 전송 오류:', systemMessageError);
      // 시스템 메시지 실패해도 채팅방 나가기는 계속 진행
    } else {
      console.log('시스템 메시지 전송 성공:', systemMessageData);
      console.log('저장된 시스템 메시지 상세:', {
        id: systemMessageData.id,
        content: systemMessageData.content,
        is_system_message: systemMessageData.is_system_message,
        chat_id: systemMessageData.chat_id,
        sender_id: systemMessageData.sender_id,
      });
    }

    // 3단계: 논리적 삭제 (현재 사용자의 active 상태를 false로 설정하고 나간 시점 기록)
    const currentTime = new Date().toISOString();
    const updateData = isCurrentUserUser1
      ? { user1_active: false, user1_left_at: currentTime }
      : { user2_active: false, user2_left_at: currentTime };

    const { error: updateError } = await supabase
      .from('direct_chats')
      .update(updateData)
      .eq('id', chatId);

    if (updateError) {
      console.error('채팅방 비활성화 오류:', updateError);
      return { success: false, error: '채팅방 나가기에 실패했습니다.' };
    }

    // 4단계: 두 사용자가 모두 나갔는지 확인하고 채팅방 완전 삭제
    const { data: updatedChat, error: checkError } = await supabase
      .from('direct_chats')
      .select('user1_active, user2_active')
      .eq('id', chatId)
      .single();

    if (!checkError && updatedChat) {
      // 두 사용자가 모두 나간 경우 (user1_active = false AND user2_active = false)
      if (!updatedChat.user1_active && !updatedChat.user2_active) {
        console.log('두 사용자가 모두 나감. 채팅방 완전 삭제.');

        // 채팅방과 관련된 모든 메시지도 함께 삭제
        const { error: deleteMessagesError } = await supabase
          .from('direct_messages')
          .delete()
          .eq('chat_id', chatId);

        if (deleteMessagesError) {
          console.error('메시지 삭제 오류:', deleteMessagesError);
        } else {
          console.log('채팅방의 모든 메시지 삭제 완료');
        }

        // 채팅방 삭제
        const { error: deleteChatError } = await supabase
          .from('direct_chats')
          .delete()
          .eq('id', chatId);

        if (deleteChatError) {
          console.error('채팅방 삭제 오류:', deleteChatError);
        } else {
          console.log('채팅방 완전 삭제 완료');
        }
      }
    }

    // 4단계: 채팅방의 마지막 메시지 시간 업데이트
    const { error: timestampError } = await supabase
      .from('direct_chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chatId);

    if (timestampError) {
      console.error('채팅방 타임스탬프 업데이트 오류:', timestampError);
      // 오류가 있어도 성공으로 처리
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

/**
 * 1:1 채팅방 복구 (재참여)
 * - 사용자가 나간 채팅방을 다시 활성화
 * - is_active를 true로 변경하여 채팅방 목록에 다시 표시
 *
 * @param chatId - 복구할 채팅방 ID
 */
export async function restoreDirectChat(chatId: string): Promise<ChatApiResponse<boolean>> {
  try {
    const currentUser = await getCurrentUser();

    // 1단계: 채팅방 소유권 확인
    const { data: chat, error: chatError } = await supabase
      .from('direct_chats')
      .select('*')
      .eq('id', chatId)
      .single();

    // 사용자가 채팅방에 참여했는지 확인
    if (chat && chat.user1_id !== currentUser.id && chat.user2_id !== currentUser.id) {
      return { success: false, error: '채팅방에 접근할 수 없습니다.' };
    }

    if (chatError || !chat) {
      console.error('채팅방 조회 오류:', chatError);
      return { success: false, error: '채팅방을 찾을 수 없습니다.' };
    }

    // 2단계: 채팅방 재활성화 (현재 사용자의 active 상태를 true로 설정)
    const isCurrentUserUser1 = chat.user1_id === currentUser.id;
    const updateData = isCurrentUserUser1 ? { user1_active: true } : { user2_active: true };

    const { error: updateError } = await supabase
      .from('direct_chats')
      .update(updateData)
      .eq('id', chatId);

    if (updateError) {
      console.error('채팅방 재활성화 오류:', updateError);
      return { success: false, error: '채팅방 복구에 실패했습니다.' };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('restoreDirectChat 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
