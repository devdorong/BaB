import type { NotificationsProps } from '@/lib/notification';
import { supabase } from '@/lib/supabase';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface RealTimeNotificationContextType {
  notifications: NotificationsProps[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsProps[]>>;
  isLoading: boolean;
}

const NotificationRealTimeContext = createContext<RealTimeNotificationContextType | undefined>(
  undefined,
);

export const NotificationRealTimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationsProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const authSubscriptionRef = useRef<ReturnType<typeof supabase.auth.onAuthStateChange> | null>(
    null,
  );
  // 선택된 유저인가?
  const currentUserIdRef = useRef<string | null>(null);
  const setupInProgressRef = useRef(false);

  useEffect(() => {
    //2025-10-30 로그인/로그아웃 시에도 알림 초기화 및 구독 재설정
    const setupRealTime = async () => {
      // 이미 설정중이면 중단
      if (setupInProgressRef.current) return;

      setupInProgressRef.current = true;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // 로그아웃 상태: 채널 제거 및 알림 초기화
          if (channelRef.current) {
            await supabase.removeChannel(channelRef.current);
            channelRef.current = null;
          }
          currentUserIdRef.current = null;
          setNotifications([]);
          setIsLoading(false);

          return;
        }

        // 같은 유저면 다시 설정하지 않음
        if (currentUserIdRef.current === user.id && channelRef.current) {
          setIsLoading(false);
          return;
        }
        currentUserIdRef.current = user.id;

        // 초기 알림 목록 로드 (초기 진입시 배지 숫자 표시용)
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
          // 초기 로드 실패는 무시 (실시간으로 따라잡힘)
        } finally {
          setIsLoading(false);
        }

        // 기존 패널 제거
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }

        // 실시간 구독 시작
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
            payload => {
              if (payload.eventType === 'INSERT') {
                const newNotification = payload.new as NotificationsProps;
                setNotifications(prev =>
                  prev.some(n => n.id === newNotification.id) ? prev : [newNotification, ...prev],
                );
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
            console.log('구독상태:', status);
          });
      } finally {
        setupInProgressRef.current = false;
      }
    };
    setupRealTime();

    // Auth 상태 변경 감지
    authSubscriptionRef.current = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth 상태 변경:', event);

      if (event === 'SIGNED_OUT') {
        // 로그아웃 시 정리
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        currentUserIdRef.current = null;
        setNotifications([]);
        setIsLoading(false);
      } else if (event === 'SIGNED_IN' && session?.user) {
        // 다른 유저로 로그인한 경우에만 재설정
        if (currentUserIdRef.current && currentUserIdRef.current !== session.user.id) {
          console.log('다른 유저로 로그인, 재설정 필요');
          currentUserIdRef.current = null;
          await setupRealTime();
        } else if (!currentUserIdRef.current) {
          // currentUserIdRef가 null인 경우 (로그아웃 후 첫 로그인)
          console.log('로그아웃 후 첫 로그인, 설정 시작');
          await setupRealTime();
        } else {
          console.log('같은 유저의 SIGNED_IN 이벤트, 스킵');
        }
      }
    });
    // document.addEventListener('visibilitychange', handleVisibilityChange);

    // 2025-10-30 로그인 직후(SESSION/SIGNED_IN)에도 즉시 알림 개수 표시되도록 구독 재설정
    // if (!authSubscriptionRef.current) {
    //   authSubscriptionRef.current = supabase.auth.onAuthStateChange(async event => {
    //     if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
    //       await setupRealTime();
    //     }
    //     if (event === 'SIGNED_OUT') {
    //       if (channelRef.current) {
    //         await supabase.removeChannel(channelRef.current);
    //         channelRef.current = null;
    //       }
    //       setNotifications([]);
    //     }
    //   });
    // }

    return () => {
      if (channelRef.current) {
        // console.log('Realtime 채널 정리');
        supabase.removeChannel(channelRef.current);
      }
      if (authSubscriptionRef.current) {
        authSubscriptionRef.current.data.subscription.unsubscribe();
        authSubscriptionRef.current = null;
      }
    };
  }, []);

  return (
    <NotificationRealTimeContext.Provider value={{ notifications, setNotifications, isLoading }}>
      {children}
    </NotificationRealTimeContext.Provider>
  );
};

export const useRealTimeNotification = () => {
  const ctx = useContext(NotificationRealTimeContext);
  if (!ctx) throw new Error('컨택스트 없음');
  return ctx;
};
