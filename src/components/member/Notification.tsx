import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import type { NotificationsProps } from '../../lib/notification';
import {
  CheckboxCircleLine,
  CheckDoubleLine,
  CheckLine,
  CloseFill,
  GiftFill,
  Message2Fill,
  QuestionAnswerFill,
  Settings5Fill,
  ShoppingCartFill,
  StarFill,
} from '../../ui/Icon';
import { CheckCheckIcon } from 'lucide-react';

export const badgeColors: Record<NotificationsProps['type'], string> = {
  주문: 'bg-bab-500',
  리뷰: 'bg-yellow-400',
  시스템: 'bg-babbutton-blue',
  채팅: 'bg-yellow-100 text-yellow-700',
  매칭완료: 'bg-[#FFF1E6] text-[#FF5722]',
  댓글: 'bg-green-100 text-green-700',
  매칭취소: 'bg-red-100 text-red-600',
  이벤트: 'bg-blue-100 text-blue-700',
};

export const borderColors: Record<NotificationsProps['type'], string> = {
  주문: 'bg-bab-500',
  리뷰: 'bg-yellow-400',
  시스템: 'bg-babbutton-blue',
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

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const notifications = [
  {
    id: 1,
    profile_id: '11111111-aaaa-bbbb-cccc-222222222222', // 알림 보낸 회원
    receiver_id: '99999999-aaaa-bbbb-cccc-000000000000', // 알림 받는 파트너
    title: '새로운 채팅이 도착했습니다 💬',
    content: '회원 dorong님이 새로운 메시지를 보냈습니다.',
    time: '1분 전',
    target: 'profiles',
    type: '채팅',
    restaurant_id: null,
    is_read: false,
  },
  {
    id: 2,
    profile_id: '33333333-aaaa-bbbb-cccc-444444444444',
    receiver_id: '99999999-aaaa-bbbb-cccc-000000000000',
    title: '매칭이 완료되었습니다 🤝',
    content: '"로제파스타 매칭"이 성공적으로 완료되었습니다!',
    time: '10분 전',
    target: 'profiles',
    type: '매칭완료',
    restaurant_id: null,
    is_read: false,
  },
  {
    id: 3,
    profile_id: '55555555-aaaa-bbbb-cccc-666666666666',
    receiver_id: '99999999-aaaa-bbbb-cccc-000000000000',
    title: '이벤트가 시작되었습니다 🎉',
    content: '"10월 한정 1+1 쿠폰 이벤트"가 시작되었습니다!',
    time: '1시간 전',
    target: 'profiles',
    type: '이벤트',
    restaurant_id: null,
    is_read: false,
  },
  {
    id: 4,
    profile_id: '55555555-aaaa-bbbb-cccc-666666666666',
    receiver_id: '99999999-aaaa-bbbb-cccc-000000000000',
    title: '이벤트가 시작되었습니다 🎉',
    content: '"10월 한정 1+1 쿠폰 이벤트"가 시작되었습니다!',
    time: '1시간 전',
    target: 'profiles',
    type: '매칭취소',
    restaurant_id: null,
    is_read: false,
  },
  {
    id: 5,
    profile_id: '55555555-aaaa-bbbb-cccc-666666666666',
    receiver_id: '99999999-aaaa-bbbb-cccc-000000000000',
    title: '이벤트가 시작되었습니다 🎉',
    content: '"10월 한정 1+1 쿠폰 이벤트"가 시작되었습니다!',
    time: '1시간 전',
    target: 'profiles',
    type: '댓글',
    restaurant_id: null,
    is_read: false,
  },
];

export default function Notification({ isOpen, onClose }: NotificationProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // 패널 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={panelRef}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed right-0 top-0 h-full w-[350px] bg-white shadow-xl border-l border-gray-200 z-50 p-5 flex flex-col"
          >
            {/* 상단 타이틀 */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-bab-500">알림</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <RiCloseLine size={22} />
              </button>
            </div>
            <hr />

            {/* 알림 목록 */}
            <div className="flex flex-col mt-5 gap-3 overflow-y-auto scrollbar-hide">
              {notifications.map(n => {
                return (
                  <>
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        opacity: 0.7,
                        transition: { duration: 0.6, ease: 'easeInOut' },
                      }}
                      className={`flex bg-white items-start gap-3 cursor-pointer border rounded-lg p-4 border-l-4 ${n.is_read === true ? ' border border-babgray border-l-4' : ` ${borderColors[n.type as NotificationsProps['type']].split(' ')[2]} ${borderColors[n.type as NotificationsProps['type']].split(' ')[1]}`}`}
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-md  ${IconColors[n.type as NotificationsProps['type']]}`}
                      >
                        {n.type === '매칭완료' ? (
                          <CheckLine size={20} bgColor="none" />
                        ) : n.type === '채팅' ? (
                          <Message2Fill bgColor="none" size={20} />
                        ) : n.type === '이벤트' ? (
                          <GiftFill bgColor="#4382e7" size={20} />
                        ) : n.type === '매칭취소' ? (
                          <CloseFill bgColor="none" size={20} />
                        ) : (
                          <QuestionAnswerFill bgColor="none" size={20} />
                        )}
                      </div>
                      {/* <div className="text-lg">{n.title}</div> */}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">{n.title}</p>
                        <p className="text-xs text-gray-400">{n.time}</p>
                      </div>
                    </motion.div>
                  </>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
