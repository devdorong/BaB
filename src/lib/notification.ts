import { supabase } from './supabase';

export type NotificationTarget = 'all' | 'profiles' | 'partner';

export interface NotificationsProps {
  id: number;
  profile_id: string;
  receiver_id: string;
  title: string;
  content: string;
  target: NotificationTarget;
  created_at: string;
  type:
    | '주문'
    | '리뷰'
    | '시스템'
    | '채팅'
    | '매칭완료'
    | '모집완료'
    | '댓글'
    | '매칭취소'
    | '이벤트';
  is_read: boolean;
  restaurant_id: number | null;
}

// 슈퍼베이스에서 파트너 알림목록 불러오기
export const fetchNotificationData = async (): Promise<NotificationsProps[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // console.error('사용자를 찾을 수 없습니다.');
    return [];
  }
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('receiver_id', user.id)
    .in('target', ['all', 'partner'])
    .order('is_read', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
};

// 슈퍼베이스에서 회원 알림목록 불러오기
export const fetchNotificationProfileData = async (): Promise<NotificationsProps[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // console.error('사용자를 찾을 수 없습니다.');
    return [];
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('receiver_id', user.id)
    .in('target', ['all', 'profiles'])
    .order('is_read', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

// 알림 읽음 처리
export const handleReadNotification = async (id: number) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);

  if (error) throw error;
};

// 3일 지난 (읽은) 알림은 삭제
export const deleteReadNotification = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 1);

  const { error } = await supabase
    .from('notifications')
    .delete()
    .lt('created_at', threeDaysAgo.toISOString())
    .eq('is_read', true);

  if (error) throw error;
};

// 모든 알림 한번에 읽음 처리
export const handleReadAllNotifications = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
};
