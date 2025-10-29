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

  useEffect(() => {
    const setupRealTime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log('사용자 찾을 수 없음');
        return;
      }

      console.log('구독시작');

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

    return () => {
      if (channelRef.current) {
        // console.log('Realtime 채널 정리');
        supabase.removeChannel(channelRef.current);
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
