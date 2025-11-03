import type { NotificationsProps } from '@/lib/notification';
import { supabase } from '@/lib/supabase';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface RealTimeNotificationContextType {
  notifications: NotificationsProps[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsProps[]>>;
}

const NotificationRealTimeContext = createContext<RealTimeNotificationContextType | undefined>(
  undefined,
);

export const NotificationRealTimeProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationsProps[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const authSubscriptionRef = useRef<ReturnType<typeof supabase.auth.onAuthStateChange> | null>(
    null,
  );
  const hasInitialLoadedRef = useRef(false);

  useEffect(() => {
    //2025-10-30 로그인/로그아웃 시에도 알림 초기화 및 구독 재설정
    const setupRealTime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // 로그아웃 상태: 채널 제거 및 알림 초기화
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
        setNotifications([]);
        hasInitialLoadedRef.current = false;
        return;
      }

      //2025-10-30
      // 초기 알림 목록 로드 (초기 진입시 배지 숫자 표시용)
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('receiver_id', user.id)
          .order('is_read', { ascending: true })
          .order('created_at', { ascending: false });
        if (!error && data) {
          setNotifications(data as NotificationsProps[]);
          hasInitialLoadedRef.current = true;
        }
      } catch {
        // 초기 로드 실패는 무시 (실시간으로 따라잡힘)
      }

      // 실시간 구독 시작

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
          payload => {
            if (payload.eventType === 'INSERT') {
              const newNotification = payload.new as NotificationsProps;
              setNotifications(prev =>
                prev.some(n => n.id === newNotification.id) ? prev : [newNotification, ...prev],
              );
            } else if (payload.eventType === 'UPDATE') {
              setNotifications(prev =>
                prev.map(n => (n.id === payload.new.id ? (payload.new as NotificationsProps) : n)),
              );
            } else if (payload.eventType === 'DELETE') {
              setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
            }
          },
        )
        .subscribe(status => {
          console.log('구독상태:', status);
        });
    };
    setupRealTime();

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
    <NotificationRealTimeContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationRealTimeContext.Provider>
  );
};

export const useRealTimeNotification = () => {
  const ctx = useContext(NotificationRealTimeContext);
  if (!ctx) throw new Error('컨택스트 없음');
  return ctx;
};
