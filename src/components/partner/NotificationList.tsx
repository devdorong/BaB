import { useEffect, useState } from 'react';
import {
  deleteReadNotification,
  fetchNotificationData,
  handleReadNotification,
  type NotificationsProps,
} from '../../lib/notification';
import { badgeColors, borderColors, IconColors } from '../../pages/partner/NotificationPage';
import { Settings5Fill, ShoppingCartFill, StarFill } from '../../ui/Icon';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface selectedTypeCategoriesProps {
  selectedTypeCategories: string;
  notification: NotificationsProps[];
  tabs: { label: string; count: number }[];
  onRead: (id: number) => void;
}

const NotificationList = ({
  selectedTypeCategories,
  notification,
  onRead,
}: selectedTypeCategoriesProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 카테고리 필터 적용
  const filtered =
    selectedTypeCategories === '전체'
      ? notification
      : notification.filter(item => item.type === selectedTypeCategories);

  const loadNotification = async () => {
    try {
      await fetchNotificationData();
      // console.log(Notification);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotification();
  }, []);

  if (loading) {
    // 스켈레톤 UI
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 border border-gray-200 rounded-lg p-4 animate-pulse bg-white"
          >
            {/* 아이콘 자리 */}
            <div className="w-10 h-10 rounded-md bg-gray-200 flex-shrink-0" />
            {/* 텍스트 */}
            <div className="flex-1 space-y-3">
              <div className="w-3/4 h-6 bg-gray-200 rounded" />
              <div className="w-5/6 h-4 bg-gray-200 rounded" />
              <div className="w-1/3 h-3 bg-gray-200 rounded" />
            </div>
            {/* 배지 */}
            <div className="w-12 h-5 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const handleClick = async (item: NotificationsProps) => {
    try {
      // 읽음 처리
      await handleReadNotification(item.id);

      onRead(item.id);
      if (item.restaurant_id) {
        navigate(`/partner/review`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   deleteReadNotification();
  // }, []);

  return (
    <div className="space-y-3">
      {notification
        .filter(n => selectedTypeCategories === '전체' || n.type === selectedTypeCategories)
        .map(item => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className={`flex bg-white items-start gap-3 cursor-pointer border rounded-lg p-4 border-l-4 
              ${item.is_read === true ? ' border border-babgray border-l-4' : ` ${borderColors[item.type].split(' ')[2]} ${borderColors[item.type].split(' ')[1]}`}`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-md  ${IconColors[item.type]}`}
            >
              {item.type === '주문' ? (
                <ShoppingCartFill size={20} />
              ) : item.type === '리뷰' ? (
                <StarFill bgColor="none" size={20} />
              ) : (
                <Settings5Fill bgColor="#3b82f6" size={20} />
              )}
            </div>
            {/* 본문 */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-[15px] text-gray-900">{item.title}</p>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.is_read === true ? 'none' : `${IconColors[item.type]}`} `}
                ></span>
              </div>
              <div className="flex flex-col gap-[15px]">
                <p className="text-[12px] text-gray-600">{item.content}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {/* 상태 뱃지 */}
            <div className="shrink-0">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeColors[item.type]}`}
              >
                {item.type}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationList;
