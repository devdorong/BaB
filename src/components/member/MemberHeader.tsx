import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ButtonFillMd, ButtonFillSm, ButtonLineMd, GrayButtonFillSm } from '../../ui/button';
import { LogoSm } from '../../ui/Ui';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../lib/propile';
import type { Profile } from '../../types/bobType';
import {
  CalendarLine,
  Chat3Line,
  CustomerServiceLine,
  GiftLine,
  LoopLeftLine,
  Notification2Line,
  StarLine,
} from '../../ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import Notification from './Notification';
import {
  fetchNotificationProfileData,
  handleReadNotification,
  type NotificationsProps,
} from '../../lib/notification';
import { notification } from 'antd/lib';
import { supabase } from '../../lib/supabase';
import { RiCloseLine, RiMenuLine } from 'react-icons/ri';

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
  // 모바일
  const [menuOpen, setMenuOpen] = useState(false);
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

  const loadNotification = async () => {
    const data = await fetchNotificationProfileData();
    setNotification(data);
  };
  useEffect(() => {
    loadNotification();

    const existing = supabase.getChannels().find(c => c.topic === 'realtime:public:notifications');
    if (existing) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
        if (payload.eventType === 'INSERT') {
          setNotification(prev => {
            const exists = prev.some(n => n.id === (payload.new as NotificationsProps).id);
            if (exists) return prev; // ✅ 중복 방지
            const updated = [payload.new as NotificationsProps, ...prev];
            return updated.sort(
              (a, b) =>
                (a.is_read ? 1 : 0) - (b.is_read ? 1 : 0) ||
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            );
          });
        } else if (payload.eventType === 'UPDATE') {
          setNotification(prev => {
            const updated = prev.map(n =>
              n.id === payload.new.id ? (payload.new as NotificationsProps) : n,
            );
            return updated.sort(
              (a, b) =>
                (a.is_read ? 1 : 0) - (b.is_read ? 1 : 0) ||
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            );
          });
        }
      })
      .subscribe(status => console.log('📡 Notification realtime status:', status));

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
      <div className="flex justify-between w-[1280px] h-[70px] items-center mx-auto pl-4 sm:pl-6 lg:pl-8 xl:pl-0">
        {/* 로고 */}
        <Link to={'/member'}>
          <LogoSm />
        </Link>

        {/* 데탑메뉴 */}
        <div className="flex items-center gap-[40px] ">
          <nav className="hidden lg:flex items-center gap-[40px] text-babgray-800">
            <NavLink
              to="/member/matching"
              className={({ isActive }) =>
                `flex items-center gap-[8px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <LoopLeftLine color="none" bgColor="none" size={16} />
              <p>매칭</p>
            </NavLink>
            <NavLink
              to="/member/community"
              className={({ isActive }) =>
                `flex items-center gap-[8px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <Chat3Line color="none" bgColor="none" size={16} />
              <p>커뮤니티</p>
            </NavLink>

            <NavLink
              to="/member/reviews"
              className={({ isActive }) =>
                `flex items-center gap-[8px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <StarLine color="none" bgColor="none" size={16} />
              <p>맛집추천</p>
            </NavLink>

            <NavLink
              to="/member/events"
              className={({ isActive }) =>
                `flex items-center gap-[8px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <GiftLine color="none" bgColor="none" size={16} />
              <p>이벤트</p>
            </NavLink>

            <NavLink
              to="/member/support"
              className={({ isActive }) =>
                `flex items-center gap-[8px] ${isActive ? 'text-bab' : 'hover:text-bab'}`
              }
            >
              <CustomerServiceLine color="none" bgColor="none" size={16} />
              <p>고객센터</p>
            </NavLink>
          </nav>

          {/* 로그인 / 알림 / 파트너 */}
          <div className="hidden lg:flex items-center gap-[24px]">
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
                  </div>
                  <div className="flex relative items-center">
                    {isAdmin && (
                      <GrayButtonFillSm
                        style={{
                          position: 'absolute',
                          left: '30px',
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
                          left: '30px',
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
              <div className="flex gap-[10px]">
                <div onClick={() => navigate('/member/login')}>
                  <ButtonLineMd style={{ fontWeight: 400 }}>로그인</ButtonLineMd>
                </div>
                <div onClick={() => navigate('/member/signup')}>
                  <ButtonFillMd style={{ fontWeight: 400 }}>회원가입</ButtonFillMd>
                </div>
              </div>
            )}
          </div>

          {/* 모바일 햄버거 */}
          <div className="lg:hidden flex gap-5 items-center pr-4 sm:pr-6 lg:pr-8 xl:pr-0">
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
            </div>
            <button onClick={() => setMenuOpen(true)}>
              <RiMenuLine size={22} />
            </button>
          </div>
        </div>
      </div>
      {/* 모바일 메뉴 슬라이드 패널 */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white border-l border-babgray-150 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* 메뉴 항목 */}
        <nav className="flex flex-col gap-6 px-6 text-babgray-800">
          <NavLink to="/member/community" onClick={() => setMenuOpen(false)}>
            커뮤니티
          </NavLink>
          <NavLink to="/member/matching" onClick={() => setMenuOpen(false)}>
            매칭
          </NavLink>
          <NavLink to="/member/reviews" onClick={() => setMenuOpen(false)}>
            맛집추천
          </NavLink>
          <NavLink to="/member/events" onClick={() => setMenuOpen(false)}>
            이벤트
          </NavLink>
          <NavLink to="/member/support" onClick={() => setMenuOpen(false)}>
            고객센터
          </NavLink>
          {user ? (
            <>
              <hr className="border-babgray-150" />
              <Link to="/member/profile" onClick={() => setMenuOpen(false)}>
                내 프로필
              </Link>
              <div onClick={() => navigate('/member/logout')} className="cursor-pointer">
                로그아웃
              </div>
            </>
          ) : (
            <>
              <hr className="border-babgray-150" />
              <div onClick={() => navigate('/member/login')}>로그인</div>
              <div onClick={() => navigate('/member/signup')}>회원가입</div>
            </>
          )}
        </nav>
      </div>
      {/* 배경 블러 (메뉴 열렸을 때) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default MemberHeader;
