/**
 * 1 : 1 채팅 Context Provider
 *  - 1 : 1 채팅 기능 전역 상태 관리
 *  - 채팅방, 메시지, 사용자 검색 등의 상태와 액션 제공
 *
 * 주요 기능
 *  - 채팅방 목록 관리
 *  - 메시지 전송 및 조회
 *  - 사용자 검색
 *  - 에러 처리
 *  - 로딩 상태 관리
 *  - 추후 실시간 채팅 업데이트 필요
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  type ChatListItem,
  type ChatUser,
  type CreateMessageData,
  type DirectMessage,
} from '../types/chatType';
import {
  exitDirectChat,
  findOrCreateDirectChat,
  getChatList,
  getMessages,
  sendMessage as sendMessageService,
  searchUsers as searchUsersService,
  clearNewChatNotification,
  restoreDirectChat,
  getInactiveChatList,
} from '../services/directChatService';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

/**
 * DirectChatContext 의  Context 타입 정의
 * state 의 모양
 * action 의 모양
 */
/**
 * DirectChatContext의 타입 정의
 * 채팅 관련 상태와 액션을 관리하는 Context의 인터페이스
 */
interface DirectChatContextType {
  // state ========================
  chats: ChatListItem[]; // 채팅방 여러개 관리
  inactiveChats: ChatListItem[]; // 비활성화된 채팅방 목록
  messages: DirectMessage[]; // 여러 메시지를 관리
  users: ChatUser[]; // 검색된 여러 사용자
  currentChat: ChatListItem | null; // 현재 선택된 채팅방 정보
  setCurrentChat: (chat: ChatListItem | null) => void;
  loading: boolean; // 로딩 상태 관리
  userSearchLoading: boolean; // 사용자 검색 로딩 상태 (별도 관리)
  error: string | null; // 에러 메시지 상태
  hasNewChatNotification: boolean; // 새 채팅방 알림 여부
  // action ========================
  loadChats: () => Promise<void>; // 채팅 목록 로딩 상태관리
  loadInactiveChats: () => Promise<void>; // 비활성화된 채팅방 목록 로딩
  loadMessages: (chatId: string, isInitialLoad?: boolean) => Promise<void>; // 특정 채팅방의 메시지 조회
  // 2025-10-21 수정: isInitialLoad 매개변수 추가 - 초기 로딩과 실시간 업데이트 구분하여 로딩 상태 최적화
  // 메시지가 제대로 전송되었는지 아닌지 체크를 위해서 boolean 리턴 타입
  sendMessage: (messageData: CreateMessageData) => Promise<boolean>; // 메시지 전송
  searchUsers: (searchTerm: string) => Promise<void>; // 검색어(닉네임)롤 사용자 검색
  createDirectChat: (participantId: string) => Promise<string | null>; // 채팅방 생성 또는 접근
  exitDirectChat: (chatId: string) => Promise<boolean>; // 채팅방 나가기
  restoreDirectChat: (chatId: string) => Promise<boolean>; // 채팅방 복구
  clearNewChatNotification: (chatId: string) => Promise<boolean>; // 새 채팅방 알림 해제
  clearError: () => void; // 에러 상태만 초기화 하기
}
// 컨텍스트 생성
const DirectChatContext = createContext<DirectChatContextType | null>(null);

// Provide 의 Props
interface DirectChatProiderProps {
  children: React.ReactNode;
}
// Provider 생성
export const DirectChatProider: React.FC<DirectChatProiderProps> = ({ children }) => {
  // 상태관리
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [inactiveChats, setInactiveChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [userSearchLoading, setUserSearchLoading] = useState(false); // 사용자 검색 전용 로딩 상태
  const [error, setError] = useState<string | null>(null);
  const [hasNewChatNotification, setHasNewChatNotification] = useState(false);

  // 사용자가 선택해서 활성화한 채팅방의 ID 를 보관함.
  // 리랜더링이 되어서 값이 갱신되거나, 화면에 보여줄 필요는 없음.
  const currentChatId = useRef<string | null>(null);

  // 현재 사용자 정보
  const { user } = useAuth();
  const currentUserId = user?.id;

  // 공통 기능 함수
  // 에러 메시지 전용 함수
  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // 액션들
  // 채팅방 목록 가져오기 : 내가 참여한 목록
  const loadChats = useCallback(async () => {
    try {
      // 채팅방 목록 로드 시에는 전역 로딩 상태를 사용하지 않음 (사용자 경험 개선)
      const response = await getChatList();
      if (response.success && response.data) {
        setChats(response.data); // 목록담기

        // 새 채팅방 알림 상태 업데이트
        const hasNewChat = response.data.some(chat => chat.is_new_chat);
        setHasNewChatNotification(hasNewChat);
      } else {
        handleError(response.error || '채팅방 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      handleError('채팅방 목록 로드 중 오류가 발생했습니다.');
    }
  }, [handleError]);

  // 새 채팅방 알림 해제 핸들러
  const clearNewChatNotificationHandler = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        const response = await clearNewChatNotification(chatId);
        if (response.success) {
          // 채팅방 목록 새로고침
          await loadChats();
          return true;
        }
        return false;
      } catch (error) {
        console.error('알림 해제 오류:', error);
        return false;
      }
    },
    [loadChats],
  );

  // 선택된 채팅방의 모든 메시지 가져오기
  // 2025-10-21 수정: isInitialLoad 매개변수 추가로 초기 로딩과 실시간 업데이트 구분하여 UX 개선
  const loadMessages = useCallback(
    async (chatId: string, isInitialLoad: boolean = false) => {
      try {
        // 초기 로딩일 때만 로딩 상태 표시
        if (isInitialLoad) {
          setLoading(true);
        }

        // 현재 활성화된 채팅방 ID 보관
        currentChatId.current = chatId;

        // 현재 채팅방 정보 찾기
        const chatInfo = chats.find(chat => chat.id === chatId);
        if (chatInfo) {
          setCurrentChat(chatInfo);
          // 새 채팅방 알림이 있으면 해제
          if (chatInfo.is_new_chat) {
            await clearNewChatNotificationHandler(chatId);
          }
        }

        setChats(prev =>
          prev.map(chat => (chat.id === chatId ? { ...chat, unread_count: 0 } : chat)),
        );

        const response = await getMessages(chatId);
        if (response.success && response.data) {
          setMessages(response.data);
        } else {
          handleError(response.error || '메시지를 불러올 수 없습니다.');
        }
        await loadChats();
      } catch (err) {
        handleError('메시지 로드 중 오류가 발생했습니다.');
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    [handleError, loadChats],
  );

  const sendMessage = useCallback(
    async (messageData: CreateMessageData) => {
      try {
        // 메시지 전송 시에는 전역 로딩 상태를 사용하지 않음 (사용자 경험 개선)
        const response = await sendMessageService(messageData);
        if (response.success && response.data) {
          // 메시지 전송 성공 후 즉시 로컬 상태에 메시지 추가 (자연스러운 UX)
          // =========== 11/11 채팅 이중 수정
          // setMessages(prev => [...prev, response.data!]);

          // 채팅방 목록만 업데이트 (메시지는 Realtime)
          await loadChats();

          return true;
        } else {
          handleError(response.error || '메시지 전송에 실패했습니다.');
          return false;
        }
      } catch (err) {
        handleError('메시지 전송 중 오류가 발생했습니다.');
        return false;
      }
    },
    [handleError, loadChats],
  );

  /**
   * 검색어로 사용자 목록 출력
   *
   * @param searchTerm - 검색할 사용자 닉네임 또는 이메일
   *
   * 수정사항:
   * - 전역 로딩 상태(setLoading) 제거하여 불필요한 리랜더링 방지
   * - 검색 기능만 담당하도록 단순화
   * - 로딩 상태는 컴포넌트에서 로컬로 관리
   */
  const lastSearchId = useRef(0);

  const searchUsers = useCallback(
    async (searchTerm: string) => {
      const currentId = ++lastSearchId.current;
      try {
        setUserSearchLoading(true); // 사용자 검색 전용 로딩 상태 사용
        // Supabase를 통해 사용자 검색 API 호출
        const response = await searchUsersService(searchTerm);

        if (currentId !== lastSearchId.current) return;

        if (response.success && response.data) {
          // 검색 성공 시 사용자 목록 상태 업데이트
          setUsers(response.data);
        } else {
          // 검색 실패 시 에러 메시지 설정
          handleError(response.error || '사용자 검색에 실패했습니다.');
        }
      } catch (err) {
        if (currentId !== lastSearchId.current) return;
        // 예외 발생 시 에러 메시지 설정
        handleError('사용자 검색 중 오류가 발생했습니다.');
      } finally {
        setUserSearchLoading(false); // 사용자 검색 전용 로딩 상태 해제
      }
    },
    [handleError],
  );

  // 채팅방 생성 또는 있으면 선택
  const createDirectChat = useCallback(
    async (participantId: string): Promise<string | null> => {
      try {
        setLoading(true);
        const response = await findOrCreateDirectChat(participantId);

        if (response.success && response.data) {
          // 채팅방 새로 고침으로 목록 갱신
          await loadChats();
          return response.data.id; // 새 채팅ID 를 전달한 이유는 즉시 채팅방 참여
        } else {
          handleError(response.error || '채팅방 생성에 실패했습니다.');
          return null;
        }
      } catch (err) {
        handleError('채팅방 생성 중 오류가 발생했습니다.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, loadChats],
  );

  // 채팅방 나가기
  // const exitDirectChatHandler = useCallback(
  //   async (chatId: string): Promise<boolean> => {
  //     try {
  //       setLoading(true);
  //       const response = await exitDirectChat(chatId);
  //       if (response.success) {
  //         // 채팅방 목록에서 제거
  //         setChats(prev => prev.filter(chat => chat.id !== chatId));
  //         // 현재 채팅방이 나간 채팅방이면 초기화
  //         if (currentChatId.current === chatId) {
  //           currentChatId.current = null;
  //           setCurrentChat(null);
  //           setMessages([]);
  //         }
  //         return true;
  //       } else {
  //         handleError(response.error || '채팅방 나가기에 실패했습니다.');
  //         return false;
  //       }
  //     } catch (err) {
  //       handleError('채팅방 나가기 중 오류가 발생했습니다.');
  //       return false;
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [handleError],
  // );

  // 채팅방 나가기
  const exitDirectChatHandler = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await exitDirectChat(chatId);
        if (response.success) {
          // setChats로 직접 제거하지 말고 loadChats로 최신 목록 불러오기
          await loadChats(); // ← 변경

          // 현재 채팅방이 나간 채팅방이면 초기화
          if (currentChatId.current === chatId) {
            currentChatId.current = null;
            setCurrentChat(null);
            setMessages([]);
          }
          return true;
        } else {
          handleError(response.error || '채팅방 나가기에 실패했습니다.');
          return false;
        }
      } catch (err) {
        handleError('채팅방 나가기 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, loadChats], // ← loadChats 의존성 추가
  );

  // 비활성화된 채팅방 목록 로딩
  const loadInactiveChats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getInactiveChatList();
      if (response.success) {
        setInactiveChats(response.data || []);
      } else {
        handleError(response.error || '비활성화된 채팅방 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      handleError('비활성화된 채팅방 목록 로딩 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // 채팅방 복구
  const restoreDirectChatHandler = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await restoreDirectChat(chatId);
        if (response.success) {
          // 비활성화된 채팅방 목록에서 제거
          setInactiveChats(prev => prev.filter(chat => chat.id !== chatId));
          // 활성화된 채팅방 목록 새로고침
          await loadChats();
          return true;
        } else {
          handleError(response.error || '채팅방 복구에 실패했습니다.');
          return false;
        }
      } catch (err) {
        handleError('채팅방 복구 중 오류가 발생했습니다.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, loadChats],
  );

  // 에러메시지 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Realtime 구독 설정
  useEffect(() => {
    if (!currentUserId) return;

    // console.log('Realtime 구독 시작, 사용자 ID:', currentUserId);

    // 간단한 Realtime 테스트
    const testChannel = supabase
      .channel('test_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_chats',
        },
        payload => {
          // console.log('테스트 Realtime 수신:', payload);
        },
      )
      .subscribe(status => {
        // console.log('테스트 Realtime 상태:', status);
      });

    // 통합 채널로 모든 변경사항 감지
    const channel = supabase
      .channel(`direct_chat_realtime_${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_chats',
        },
        payload => {
          // 현재 사용자가 참여자인지 확인
          if (payload.new.user1_id === currentUserId || payload.new.user2_id === currentUserId) {
            loadChats();
          } else {
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'direct_chats',
        },
        payload => {
          // console.log('채팅방 삭제됨:', payload.old);
          // 현재 사용자가 참여자였는지 확인
          if (payload.old.user1_id === currentUserId || payload.old.user2_id === currentUserId) {
            // console.log('현재 사용자 관련 채팅방 삭제, 목록 새로고침');
            loadChats();
            // 현재 채팅방이 삭제된 채팅방이면 초기화
            if (currentChatId.current === payload.old.id) {
              currentChatId.current = null;
              setCurrentChat(null);
              setMessages([]);
            }
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_chats',
        },
        payload => {
          const oldChat = payload.old;
          const newChat = payload.new;
          const isCurrentUserUser1 = newChat.user1_id === currentUserId;

          const myOldActive = isCurrentUserUser1 ? oldChat.user1_active : oldChat.user2_active;
          const myNewActive = isCurrentUserUser1 ? newChat.user1_active : newChat.user2_active;

          const otherOldActive = isCurrentUserUser1 ? oldChat.user2_active : oldChat.user1_active;
          const otherNewActive = isCurrentUserUser1 ? newChat.user2_active : newChat.user1_active;

          // 내가 나간 경우
          if (myOldActive === true && myNewActive === false) {
            // loadChats();
            if (currentChatId.current === newChat.id) {
              setCurrentChat(null);
              setMessages([]);
            }
          }

          // 상대방이 나간 경우
          if (otherOldActive === true && otherNewActive === false) {
            loadChats();
            if (currentChatId.current === newChat.id) {
              setCurrentChat(null);
              setMessages([]);
            }
          }

          // 상대방이 복귀한 경우
          if (otherOldActive === false && otherNewActive === true) {
            loadChats();
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
        },
        async payload => {
          const newMsg = payload.new as DirectMessage;
          const isCurrentChatOpen = currentChatId.current === newMsg.chat_id;

          // === 현재 채팅방이 열려 있다면 즉시 읽음 처리 ===
          if (isCurrentChatOpen) {
            // 상대방이 보낸 메시지일 경우에만 읽음 처리
            if (newMsg.sender_id !== currentUserId) {
              await supabase
                .from('direct_messages')
                .update({
                  is_read: true,
                  read_at: new Date().toISOString(),
                })
                .eq('id', newMsg.id);
            }

            // sender 정보 보강 (기존 코드 그대로)
            let senderInfo = null;
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, nickname, avatar_url')
                .eq('id', newMsg.sender_id)
                .single();
              senderInfo = {
                id: profile?.id || newMsg.sender_id,
                email: `user-${newMsg.sender_id}@example.com`,
                nickname:
                  newMsg.sender_id === currentUserId ? '나' : profile?.nickname || '알 수 없음',
                avatar_url: profile?.avatar_url || null,
              };
            } catch {
              senderInfo = {
                id: newMsg.sender_id,
                email: `user-${newMsg.sender_id}@example.com`,
                nickname: newMsg.sender_id === currentUserId ? '나' : '알 수 없음',
                avatar_url: null,
              };
            }

            const enrichedMessage: DirectMessage = {
              ...newMsg,
              sender: senderInfo,
            };

            // 중복 메시지 방지 후 추가
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMsg.id)) return prev;
              return [...prev, enrichedMessage];
            });
          }

          // 채팅방 목록 업데이트 (단, 현재 열린 채팅방은 unread_count 갱신 생략)
          if (!isCurrentChatOpen) {
            await loadChats();
          }
        },
      )

      .subscribe();

    return () => {
      channel.unsubscribe();
      testChannel.unsubscribe();
    };
  }, [currentUserId, loadChats]);

  // chats가 갱신될 때 현재 선택된 채팅방 정보도 갱신 (nickname, avatar 등 최신화)
  useEffect(() => {
    if (currentChatId.current && chats.length > 0) {
      const updatedChat = chats.find(chat => chat.id === currentChatId.current);
      if (updatedChat) {
        setCurrentChat(updatedChat);
      }
    }
  }, [chats]);

  // Context 의 value
  const value: DirectChatContextType = {
    // 상태(state)
    chats,
    inactiveChats,
    messages,
    users,
    currentChat,
    setCurrentChat,
    loading,
    userSearchLoading, // 사용자 검색 전용 로딩 상태 추가
    error,
    hasNewChatNotification,
    // 액션 (action) : 샹태관리 업데이트 함수
    loadChats,
    loadInactiveChats,
    loadMessages,
    sendMessage,
    searchUsers,
    createDirectChat,
    exitDirectChat: exitDirectChatHandler,
    restoreDirectChat: restoreDirectChatHandler,
    clearNewChatNotification: clearNewChatNotificationHandler,
    clearError,
  };
  return <DirectChatContext.Provider value={value}>{children}</DirectChatContext.Provider>;
};

// 커스텀 훅
export const useDirectChat = () => {
  const context = useContext(DirectChatContext);
  if (!context) {
    throw new Error('채팅 컨텍스트가 생성되지 않았습니다.');
  }
  return context;
};
