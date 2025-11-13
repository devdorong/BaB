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
import { useRealTimeNotification } from './NotificationContext';

/**
 * DirectChatContext의 타입 정의
 * 채팅 관련 상태와 액션을 관리하는 Context의 인터페이스
 */
interface DirectChatContextType {
  // state ========================
  chats: ChatListItem[];
  inactiveChats: ChatListItem[];
  messages: DirectMessage[];
  users: ChatUser[];
  currentChat: ChatListItem | null;
  setCurrentChat: (chat: ChatListItem | null) => void;
  loading: boolean;
  userSearchLoading: boolean;
  error: string | null;
  hasNewChatNotification: boolean;
  // action ========================
  loadChats: () => Promise<void>;
  loadInactiveChats: () => Promise<void>;
  loadMessages: (chatId: string, isInitialLoad?: boolean) => Promise<void>;
  sendMessage: (messageData: CreateMessageData) => Promise<boolean>;
  searchUsers: (searchTerm: string) => Promise<void>;
  createDirectChat: (participantId: string) => Promise<string | null>;
  exitDirectChat: (chatId: string) => Promise<boolean>;
  restoreDirectChat: (chatId: string) => Promise<boolean>;
  clearNewChatNotification: (chatId: string) => Promise<boolean>;
  clearError: () => void;
  handleChatExit: () => void; // 채팅방 이탈 핸들러
}

const DirectChatContext = createContext<DirectChatContextType | null>(null);

interface DirectChatProiderProps {
  children: React.ReactNode;
}

export const DirectChatProider: React.FC<DirectChatProiderProps> = ({ children }) => {
  // 알림 컨텍스트에서 setCurrentChatId 가져오기
  const { setCurrentChatId: setNotificationChatId } = useRealTimeNotification();

  // 상태관리
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [inactiveChats, setInactiveChats] = useState<ChatListItem[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNewChatNotification, setHasNewChatNotification] = useState(false);

  const currentChatId = useRef<string | null>(null);

  const { user } = useAuth();
  const currentUserId = user?.id;

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const loadChats = useCallback(async () => {
    try {
      const response = await getChatList();
      if (response.success && response.data) {
        setChats(response.data);
        const hasNewChat = response.data.some(chat => chat.is_new_chat);
        setHasNewChatNotification(hasNewChat);
      } else {
        handleError(response.error || '채팅방 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      handleError('채팅방 목록 로드 중 오류가 발생했습니다.');
    }
  }, [handleError]);

  const clearNewChatNotificationHandler = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        const response = await clearNewChatNotification(chatId);
        if (response.success) {
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

  const loadMessages = useCallback(
    async (chatId: string, isInitialLoad: boolean = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

        currentChatId.current = chatId;
        setNotificationChatId(chatId); // 알림 컨텍스트에 현재 채팅방 ID 설정

        const chatInfo = chats.find(chat => chat.id === chatId);
        if (chatInfo) {
          setCurrentChat(chatInfo);
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
        // await loadChats();
      } catch (err) {
        handleError('메시지 로드 중 오류가 발생했습니다.');
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    [handleError, setNotificationChatId],
  );

  const sendMessage = useCallback(
    async (messageData: CreateMessageData) => {
      try {
        const response = await sendMessageService(messageData);
        if (response.success && response.data) {
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

  const lastSearchId = useRef(0);

  const searchUsers = useCallback(
    async (searchTerm: string) => {
      const currentId = ++lastSearchId.current;
      try {
        setUserSearchLoading(true);
        const response = await searchUsersService(searchTerm);

        if (currentId !== lastSearchId.current) return;

        if (response.success && response.data) {
          setUsers(response.data);
        } else {
          handleError(response.error || '사용자 검색에 실패했습니다.');
        }
      } catch (err) {
        if (currentId !== lastSearchId.current) return;
        handleError('사용자 검색 중 오류가 발생했습니다.');
      } finally {
        setUserSearchLoading(false);
      }
    },
    [handleError],
  );

  const createDirectChat = useCallback(
    async (participantId: string): Promise<string | null> => {
      try {
        setLoading(true);
        const response = await findOrCreateDirectChat(participantId);

        if (response.success && response.data) {
          await loadChats();
          return response.data.id;
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

  const exitDirectChatHandler = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await exitDirectChat(chatId);
        if (response.success) {
          await loadChats();

          if (currentChatId.current === chatId) {
            currentChatId.current = null;
            setCurrentChat(null);
            setMessages([]);
            setNotificationChatId(null); // 알림 컨텍스트도 초기화
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
    [handleError, loadChats, setNotificationChatId],
  );

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

  const restoreDirectChatHandler = useCallback(
    async (chatId: string): Promise<boolean> => {
      try {
        setLoading(true);
        const response = await restoreDirectChat(chatId);
        if (response.success) {
          setInactiveChats(prev => prev.filter(chat => chat.id !== chatId));
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 채팅방 이탈 핸들러
  const handleChatExit = useCallback(() => {
    currentChatId.current = null;
    setCurrentChat(null);
    setNotificationChatId(null);
  }, [setNotificationChatId]);

  // Realtime 구독 설정
  useEffect(() => {
    if (!currentUserId) return;

    const testChannel = supabase
      .channel('test_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_chats',
        },
        payload => {},
      )
      .subscribe(status => {});

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
          if (payload.new.user1_id === currentUserId || payload.new.user2_id === currentUserId) {
            loadChats();
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
          if (payload.old.user1_id === currentUserId || payload.old.user2_id === currentUserId) {
            loadChats();
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

          if (myOldActive === true && myNewActive === false) {
            if (currentChatId.current === newChat.id) {
              setCurrentChat(null);
              setMessages([]);
            }
          }

          if (otherOldActive === true && otherNewActive === false) {
            loadChats();
            if (currentChatId.current === newChat.id) {
              setCurrentChat(null);
              setMessages([]);
            }
          }

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

          if (isCurrentChatOpen) {
            if (newMsg.sender_id !== currentUserId) {
              await supabase
                .from('direct_messages')
                .update({
                  is_read: true,
                  read_at: new Date().toISOString(),
                })
                .eq('id', newMsg.id);
            }

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

            setMessages(prev => {
              if (prev.some(msg => msg.id === newMsg.id)) return prev;
              return [...prev, enrichedMessage];
            });
          }

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

  useEffect(() => {
    if (currentChatId.current && chats.length > 0) {
      const updatedChat = chats.find(chat => chat.id === currentChatId.current);
      if (updatedChat) {
        setCurrentChat(updatedChat);
      }
    }
  }, [chats]);

  const value: DirectChatContextType = {
    chats,
    inactiveChats,
    messages,
    users,
    currentChat,
    setCurrentChat,
    loading,
    userSearchLoading,
    error,
    hasNewChatNotification,
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
    handleChatExit,
  };

  return <DirectChatContext.Provider value={value}>{children}</DirectChatContext.Provider>;
};

export const useDirectChat = () => {
  const context = useContext(DirectChatContext);
  if (!context) {
    throw new Error('채팅 컨텍스트가 생성되지 않았습니다.');
  }
  return context;
};
