import { useEffect, useState } from 'react';
import { RiNotification3Fill } from 'react-icons/ri';
import NotificationList from '../../components/partner/NotificationList';
import NotificationSetting from '../../components/partner/NotificationSetting';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { fetchNotificationData, type NotificationsProps } from '../../lib/notification';
import { Settings5Fill, ShoppingCartFill, StarFill } from '../../ui/Icon';
import { supabase } from '../../lib/supabase';

export const badgeColors: Record<NotificationsProps['type'], string> = {
  주문: 'bg-bab-500 text-white',
  리뷰: 'bg-yellow-400 text-white',
  시스템: 'bg-babbutton-blue text-white',
  채팅: 'bg-yellow-100 text-yellow-700',
  매칭완료: 'bg-[#FFF1E6] text-[#FF5722]',
  댓글: 'bg-green-100 text-green-700',
  매칭취소: 'bg-red-100 text-red-600',
  이벤트: 'bg-blue-100 text-blue-700',
};

export const borderColors: Record<NotificationsProps['type'], string> = {
  주문: 'bg-bab-500 border-[#FF5722] border-l-[#FF5722]',
  리뷰: 'bg-yellow-400 border-yellow-400 border-l-yellow-400',
  시스템: 'bg-babbutton-blue border-blue-400 border-l-blue-400 ',
  채팅: 'border border-yellow-400 border-l-yellow-400 text-yellow-600',
  매칭완료: 'border border-[#FF5722] border-l-[#FF5722] text-[#FF5722]',
  댓글: 'border border-green-400 border-l-green-400 text-green-600',
  매칭취소: 'border border-red-400 border-l-red-400 text-red-600',
  이벤트: 'border border-blue-400 border-l-blue-400 text-blue-600',
};

export const IconColors: Record<NotificationsProps['type'], string> = {
  주문: 'bg-bab-500',
  리뷰: 'bg-yellow-400',
  시스템: 'bg-babbutton-blue',
  채팅: 'bg-yellow-400',
  매칭완료: 'bg-[#FF5722]',
  댓글: 'bg-green-500',
  매칭취소: 'bg-red-500',
  이벤트: 'bg-blue-500',
};

function NotificationPage() {
  const [selectedTypeCategories, setSelectedTypeCategories] = useState<TabId>('전체');
  const [notification, setNotification] = useState<NotificationsProps[]>([]);

  type TabId = (typeof tabs)[number]['label'];

  const tabs = [
    { label: '전체', count: notification.length },
    { label: '주문', count: notification.filter(n => n.type === '주문').length },
    { label: '리뷰', count: notification.filter(n => n.type === '리뷰').length },
    { label: '시스템', count: notification.filter(n => n.type === '시스템').length },
  ];

  const loadNotification = async () => {
    const data = await fetchNotificationData();
    setNotification(data);
  };

  useEffect(() => {
    loadNotification();

    const notificationChannel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        payload => {
          if (payload.eventType === 'INSERT') {
            setNotification(prev => [payload.new as NotificationsProps, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotification(prev =>
              prev.map(n => (n.id === payload.new.id ? (payload.new as NotificationsProps) : n)),
            );
          }
        },
      )
      .subscribe();

    // 클린업 함수
    return () => {
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  return (
    <>
      <PartnerBoardHeader
        title="알림"
        subtitle="레스토랑 운영과 관련된 중요한 알림을 확인하세요."
      />
      <div className="w-full flex flex-col text-babgray-800 gap-5">
        {/* 읽지않은 알림 / 주문 알림 / 새로운 리뷰 / 시스템 알림 */}
        <div className="flex gap-6 ">
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">읽지 않은 알림</p>
              <p className="text-2xl font-semibold">{notification.length}개</p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-babbutton-red rounded-lg flex items-center justify-center">
              <RiNotification3Fill className="w-[20px] h-[20px] text-white" />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">오늘 주문 알림</p>
              <p className="text-2xl font-semibold">
                {notification.filter(r => r.type === '주문').length}개
              </p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-bab rounded-lg flex items-center justify-center">
              <ShoppingCartFill size={20} />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">새로운 리뷰</p>
              {/* 새로운 리뷰 출력 (고객리뷰 탭의 하루? 최근일주일? 동안의 등록글 카운팅 출력) */}
              <p className="text-2xl font-semibold">
                {notification.filter(r => r.type === '리뷰').length}개
              </p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-yellow-400 rounded-lg flex items-center justify-center">
              <StarFill bgColor="none" size={20} />
            </div>
          </div>
          <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="text-babgray-600">시스템 알림</p>
              <p className="text-2xl font-semibold">
                {notification.filter(r => r.type === '시스템').length}개
              </p>
            </div>
            <div className="w-12 h-12 p-3.5 bg-babbutton-blue rounded-lg flex items-center justify-center">
              <Settings5Fill bgColor="#3b82f6" size={20} />
            </div>
          </div>
        </div>
        {/* 카테고리 (전체/주문/리뷰/시스템) */}
        <div className="px-6 py-5 border border-babgray bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-babgray-100 px-1 py-1">
            {tabs.map(tab => {
              const active = selectedTypeCategories === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setSelectedTypeCategories(tab.label)}
                  className={[
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                    active ? 'bg-white text-[#FF5722]' : 'text-gray-600 hover:text-gray-800',
                  ].join(' ')}
                >
                  <span>{tab.label}</span>
                  <span
                    className={['text-xs', active ? ' text-[#FF5722]' : ' text-gray-600'].join(' ')}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 알림 */}
        <div className="flex flex-col flex-1 min-h-[378px]">
          {notification.length > 0 ? (
            <div>
              <NotificationList
                selectedTypeCategories={selectedTypeCategories}
                notification={notification}
                tabs={tabs}
                onRead={(id: number) => {
                  setNotification(prev =>
                    prev.map(n => (n.id === id ? { ...n, is_read: true } : n)),
                  );
                }}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[378px] text-babgray-500 text-lg">
              현재 알림이 없습니다.
            </div>
          )}
        </div>

        {/* 알림설정 */}
        <div>
          <NotificationSetting />
        </div>
      </div>
    </>
  );
}

export default NotificationPage;
