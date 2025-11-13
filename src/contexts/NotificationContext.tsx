import type { NotificationsProps } from '@/lib/notification';
import { supabase } from '@/lib/supabase';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface RealTimeNotificationContextType {
  notifications: NotificationsProps[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsProps[]>>;
  isLoading: boolean;
  currentChatId: string | null;
  setCurrentChatId: (chatId: string | null) => void;
}

const NotificationRealTimeContext = createContext<RealTimeNotificationContextType | undefined>(
  undefined,
);

export const NotificationRealTimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationsProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const authSubscriptionRef = useRef<ReturnType<typeof supabase.auth.onAuthStateChange> | null>(
    null,
  );
  const currentUserIdRef = useRef<string | null>(null);
  const setupInProgressRef = useRef(false);
  const currentChatIdRef = useRef<string | null>(null); // currentChatId의 최신값을 추적

  // currentChatId가 변경될 때마다 ref 업데이트
  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

  useEffect(() => {
    const setupRealTime = async () => {
      if (setupInProgressRef.current) return;

      setupInProgressRef.current = true;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (channelRef.current) {
            await supabase.removeChannel(channelRef.current);
            channelRef.current = null;
          }
          currentUserIdRef.current = null;
          setNotifications([]);
          setIsLoading(false);
          return;
        }

        if (currentUserIdRef.current === user.id && channelRef.current) {
          setIsLoading(false);
          return;
        }
        currentUserIdRef.current = user.id;

        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('receiver_id', user.id)
            .order('is_read', { ascending: true })
            .order('created_at', { ascending: false });
          if (!error && data) {
            setNotifications(data as NotificationsProps[]);
          }
        } catch (error) {
          // 초기 로드 실패는 무시
        } finally {
          setIsLoading(false);
        }

        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        channelRef.current = supabase
          .channel(`notifications-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `receiver_id=eq.${user.id}`,
            },
            async payload => {
              if (payload.eventType === 'INSERT') {
                const newNotification = payload.new as NotificationsProps;

                // 채팅 알림이고 현재 채팅방에서 온 메시지인 경우 알림 추가하지 않음
                if (newNotification.type === '채팅') {
                  const senderId = newNotification.profile_id;
                  const activeChatId = currentChatIdRef.current; // ref에서 최신값 가져오기

                  // 현재 채팅방이 열려있는 경우
                  if (activeChatId && senderId) {
                    try {
                      // 채팅방 정보 확인
                      const { data: chatData } = await supabase
                        .from('direct_chats')
                        .select('user1_id, user2_id')
                        .eq('id', activeChatId)
                        .single();

                      if (chatData) {
                        // 현재 채팅방의 상대방이 보낸 메시지인지 확인
                        const isMessageFromCurrentChat =
                          chatData.user1_id === senderId || chatData.user2_id === senderId;

                        if (isMessageFromCurrentChat) {
                          // 현재 채팅 중인 상대방의 메시지이므로 알림 추가하지 않음
                          // console.log('현재 채팅 중인 상대방의 메시지 - 알림 추가 안함');

                          // 알림을 즉시 읽음 처리 (DB에서 삭제하거나 읽음 처리)
                          await supabase
                            .from('notifications')
                            .update({ is_read: true })
                            .eq('id', newNotification.id);

                          return; // 알림 추가하지 않고 종료
                        }
                      }
                    } catch (error) {
                      console.error('채팅방 확인 오류:', error);
                    }
                  }
                }

                // 채팅 알림이 아니거나 다른 채팅방의 메시지인 경우 알림 추가
                setNotifications(prev => {
                  // 중복 확인
                  if (prev.some(n => n.id === newNotification.id)) {
                    return prev;
                  }
                  return [newNotification, ...prev];
                });
              } else if (payload.eventType === 'UPDATE') {
                setNotifications(prev =>
                  prev.map(n =>
                    n.id === payload.new.id ? (payload.new as NotificationsProps) : n,
                  ),
                );
              } else if (payload.eventType === 'DELETE') {
                setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
              }
            },
          )
          .subscribe(status => {
            if (status === 'SUBSCRIBED') {
              // console.log('알림 Realtime 구독 성공');
            }
          });
      } finally {
        setupInProgressRef.current = false;
      }
    };
    setupRealTime();

    authSubscriptionRef.current = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        currentUserIdRef.current = null;
        setNotifications([]);
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' && session?.user) {
        if (currentUserIdRef.current && currentUserIdRef.current !== session.user.id) {
          currentUserIdRef.current = null;
          await setupRealTime();
        } else if (!currentUserIdRef.current) {
          await setupRealTime();
        }
      }
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.data.subscription.unsubscribe();
        authSubscriptionRef.current = null;
      }
    };
  }, []); // currentChatId 의존성 제거 - ref로 관리

  return (
    <NotificationRealTimeContext.Provider
      value={{ notifications, setNotifications, isLoading, currentChatId, setCurrentChatId }}
    >
      {children}
    </NotificationRealTimeContext.Provider>
  );
};

export const useRealTimeNotification = () => {
  const ctx = useContext(NotificationRealTimeContext);
  if (!ctx) throw new Error('컨택스트 없음');
  return ctx;
};
