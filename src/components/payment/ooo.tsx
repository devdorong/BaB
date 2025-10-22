import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogoSm } from '../../ui/Ui';
import { ButtonFillMd, ButtonFillSm, ButtonLineMd, GrayButtonFillSm } from '../../ui/button';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchNotificationProfileData,
  handleReadNotification,
  type NotificationsProps,
} from '../../lib/notification';
import { getProfile } from '../../lib/propile';
import { supabase } from '../../lib/supabase';
// ===== 결제 시스템 관련 import =====
import type { PGProvider } from '../../payment/paymentService'; // PG사 타입
import PaymentModal from '../../payment/PaymentModal'; // 결제 모달 컴포넌트

import type { Profile } from '../../types/bobType';
import {
  BankCardLine, // 결제하기 버튼 아이콘
  Chat3Line,
  CustomerServiceLine,
  GiftLine,
  Notification2Line,
  StarLine,
} from '../../ui/Icon';
import Notification from './Notification';

const MemberHeader = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');
  // 알림 패널 온오프
  const [isOpen, setIsOpen] = useState(false);
  // 알림 개수
  const [notification, setNotification] = useState<NotificationsProps[]>([]);
  // ===== 결제 시스템 관련 상태 =====

  /** 결제 모달 열림/닫힘 상태 */
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  /** 선택된 PG사 (기본값: 토스페이먼츠) */
  const [selectedPG, setSelectedPG] = useState<PGProvider>('toss');

  // ===== 샘플 주문 데이터 =====
  // TODO: 실제 운영 시에는 장바구니나 주문 페이지에서 동적으로 가져와야 함

  /** 샘플 주문 상품 목록 */
  const sampleOrderItems = [
    { id: '1', name: '마르게리타 피자', price: 25000, quantity: 1 },
    { id: '2', name: '콜라', price: 2000, quantity: 2 },
  ];

  /** 총 결제 금액 계산 (상품별 가격 × 수량의 합계) */
  const totalAmount = sampleOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isAdmin = profileData?.role === 'admin';
  const isPartner = profileData?.role === 'partner';

  // 안읽은 알림 개수
  const notificationUnReadCount = notification.filter(n => !n.is_read).length;

  // 사용자 프로필 정보
  const loadProfile = async () => {
    if (!user?.id) {
      setError('사용자정보 없음');
      setLoading(false);
      return;
    }
    try {
      // 사용자 정보 가져오기
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        // null의 경우
        setError('사용자 프로필 정보 찾을 수 없음');
        return;
      }
      // 사용자 정보 유효함
      setNickName(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadNotification = async () => {
      const data = await fetchNotificationProfileData();
      setNotification(data);
    };
    loadNotification();

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
        if (payload.eventType === 'INSERT') {
          // 새 알림 추가 시
          setNotification(prev => {
            const updated = [payload.new as NotificationsProps, ...prev];
            return updated.sort((a, b) => {
              if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
          });
        } else if (payload.eventType === 'UPDATE') {
          // 읽음 상태 변경 시
          setNotification(prev => {
            const updated = prev.map(n =>
              n.id === payload.new.id ? (payload.new as NotificationsProps) : n,
            );
            return updated.sort((a, b) => {
              if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id, location.pathname]);

  return (
    <header className="flex items-center w-full justify-between bg-white z-20 border border-babgray-150">
      <div className="flex justify-between w-[1280px] h-[70px] items-center mx-auto">
        <Link to={'/member'}>
          <LogoSm />
        </Link>
        <div className="flex items-center gap-[40px] ">
          <div className="flex items-center gap-[40px] text-babgray-800">
            <NavLink
              to="/member/community"
              className={({ isActive }) =>
                `flex items-center gap-[16px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <Chat3Line color="none" bgColor="none" size={16} />
              <p>커뮤니티</p>
            </NavLink>

            <NavLink
              to="/member/reviews"
              className={({ isActive }) =>
                `flex items-center gap-[16px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <StarLine color="none" bgColor="none" size={16} />
              <p>맛집추천</p>
            </NavLink>

            <NavLink
              to="/member/events"
              className={({ isActive }) =>
                `flex items-center gap-[16px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <GiftLine color="none" bgColor="none" size={16} />
              <p>이벤트</p>
            </NavLink>

            <NavLink
              to="/member/support"
              className={({ isActive }) =>
                `flex items-center gap-[16px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <CustomerServiceLine color="none" bgColor="none" size={16} />
              <p>고객센터</p>
            </NavLink>

            {/* 결제하기 버튼 - 클릭 시 결제 모달 열림 */}
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-[16px] hover:text-bab transition-colors"
            >
              <BankCardLine color="none" bgColor="none" size={16} />
              <p>결제하기</p>
            </button>
          </div>
          {user ? (
            <>
              <div className="flex items-center justify-center gap-2 text-babgray-800">
                <Link to={'/member/profile'}>
                  <span>{profileData?.nickname}님</span>
                </Link>
                <div onClick={() => setIsOpen(!isOpen)} className="flex relative items-center">
                  <Notification2Line color="gray" bgColor="none" size={16} />
                  {notificationUnReadCount > 0 ? (
                    <div className="w-5 h-5 p-1 left-[60%] bottom-[60%] absolute bg-bab-500 rounded-[10px] inline-flex justify-center items-center">
                      <div className="justify-start text-white text-xs font-normal ">
                        {notificationUnReadCount}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <Notification
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onRead={handleReadNotification}
                  />

                  {isAdmin && (
                    <GrayButtonFillSm
                      style={{
                        position: 'absolute',
                        left: '50px',
                        fontSize: '13px',
                      }}
                    >
                      <Link to={'/admin'}>관리자</Link>
                    </GrayButtonFillSm>
                  )}
                  {isPartner && (
                    <ButtonFillSm
                      style={{
                        position: 'absolute',
                        left: '50px',
                        fontSize: '13px',
                      }}
                    >
                      <Link to={'/partner'}>파트너</Link>
                    </ButtonFillSm>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-[10px]">
                <div onClick={() => navigate('/member/login')}>
                  <ButtonLineMd style={{ fontWeight: 400 }}>로그인</ButtonLineMd>
                </div>
                <div onClick={() => navigate('/member/signup')}>
                  <ButtonFillMd style={{ fontWeight: 400 }}>회원가입</ButtonFillMd>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== 결제 모달 컴포넌트 ===== */}
      <PaymentModal
        isOpen={isPaymentModalOpen} // 모달 열림/닫힘 상태
        onClose={() => setIsPaymentModalOpen(false)} // 모달 닫기 핸들러
        onSuccess={result => {
          // ===== 결제 완료 시 실행되는 핵심 콜백 함수 =====
          console.log('결제 성공:', result);

          // TODO: 실제 운영 시에는 여기에 추가 작업을 구현해야 합니다
          // - 주문 데이터베이스 저장
          // - 결제 내역 저장
          // - 사용자 알림 발송
          // - 재고 차감
          // - 주문 상태 업데이트
          // - 이메일/SMS 알림 발송
          // - 포인트 적립 처리

          setIsPaymentModalOpen(false); // 결제 완료 후 모달 닫기
        }}
        selectedPG={selectedPG} // 선택된 PG사
        amount={totalAmount} // 총 결제 금액
        orderItems={sampleOrderItems} // 주문 상품 목록
        orderName="도로롱의 피자 주문" // 주문명
      />
    </header>
  );
};

export default MemberHeader;
