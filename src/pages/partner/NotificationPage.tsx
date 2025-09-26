import { RiLoopLeftLine, RiNotification3Fill } from 'react-icons/ri';
import {
  MoneyDollarCircleFill,
  Settings5Fill,
  ShoppingCartFill,
  StarFill,
  TimeLine,
  UserLine,
} from '../../ui/Icon';
import TagBadge from '../../ui/TagBadge';
import { useState } from 'react';
import NotificationList from '../../components/partner/NotificationList';

const tabs = [
  { id: 'all', label: '전체', count: 6 },
  { id: 'order', label: '주문', count: 2 },
  { id: 'review', label: '리뷰', count: 1 },
  { id: 'system', label: '시스템', count: 2 },
];

export type Notification = {
  id: number;
  type: '주문' | '리뷰' | '시스템';
  title: string;
  message: string;
  time: string;
};

export const notifications: Notification[] = [
  {
    id: 1,
    type: '주문',
    title: '새로운 주문이 접수되었습니다',
    message: '김사람님이 연어구이 외 1개 메뉴를 주문했습니다. (주문번호: ORD-046)',
    time: '방금 전',
  },
  {
    id: 2,
    type: '리뷰',
    title: '새 리뷰가 등록되었습니다',
    message: '홍길동님이 매장 리뷰를 작성했습니다.',
    time: '5분 전',
  },
  {
    id: 3,
    type: '시스템',
    title: '업데이트 알림',
    message: '내일부터 새로운 기능이 추가됩니다.',
    time: '1시간 전',
  },
];

export const badgeColors: Record<Notification['type'], string> = {
  주문: 'bg-orange-100 text-orange-700',
  리뷰: 'bg-yellow-100 text-yellow-700',
  시스템: 'bg-blue-100 text-blue-700',
};

function NotificationPage() {
  const [active, setActive] = useState('all');

  return (
    <div className="w-full px-8 py-8 flex flex-col text-babgray-800 gap-10">
      {/* 읽지않은 알림 / 주문 알림 / 새로운 리뷰 / 시스템 알림 */}
      <div className="flex gap-6">
        <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-babgray-600">읽지 않은 알림</p>
            <p className="text-2xl font-semibold">6개</p>
          </div>
          <div className="w-12 h-12 p-3.5 bg-babbutton-red rounded-lg flex items-center justify-center">
            <RiNotification3Fill className="w-[20px] h-[20px] text-white" />
          </div>
        </div>
        <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-babgray-600">오늘 주문 알림</p>
            <p className="text-2xl font-semibold">24개</p>
          </div>
          <div className="w-12 h-12 p-3.5 bg-bab rounded-lg flex items-center justify-center">
            <ShoppingCartFill size={20} />
          </div>
        </div>
        <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-babgray-600">새로운 리뷰</p>
            {/* 새로운 리뷰 출력 (고객리뷰 탭의 하루? 최근일주일? 동안의 등록글 카운팅 출력) */}
            <p className="text-2xl font-semibold">8개</p>
          </div>
          <div className="w-12 h-12 p-3.5 bg-yellow-400 rounded-lg flex items-center justify-center">
            <StarFill bgColor="none" size={20} />
          </div>
        </div>
        <div className="flex-1 px-6 py-6 bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border outline-babgray flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-babgray-600">시스템 알림</p>
            <p className="text-2xl font-semibold">3개</p>
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
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={[
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-white text-[#FF5722]' : 'text-gray-600 hover:text-gray-800',
                ].join(' ')}
              >
                <span>{tab.label}</span>
                <span
                  className={['text-xs', isActive ? ' text-[#FF5722]' : ' text-gray-600'].join(' ')}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 알림 */}
      <div>
        <NotificationList />
      </div>
    </div>
  );
}

export default NotificationPage;
