import { Link, useNavigate } from 'react-router-dom';
import { ButtonFillMd, ButtonFillSm, ButtonLineMd, GrayButtonFillSm } from '../../ui/button';
import { LogoSm } from '../../ui/Ui';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../lib/propile';
import type { Profile } from '../../types/bobType';
import {
  Chat3Line,
  CustomerServiceLine,
  GiftLine,
  Notification2Line,
  StarLine,
} from '../../ui/Icon';

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
  const isAdmin = profileData?.role === 'admin';
  const isPartner = profileData?.role === 'partner';

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
            <Link to={'/member/community'} className="flex items-center gap-[16px]">
              <Chat3Line color="none" bgColor="none" size={16} />
              <p>커뮤니티</p>
            </Link>
            <Link to={'/member/reviews'} className="flex items-center gap-[16px]">
              <StarLine color="none" bgColor="none" size={16} />
              <p>맛집추천</p>
            </Link>
            <Link to={'/member/events'} className="flex items-center gap-[16px]">
              <GiftLine color="none" bgColor="none" size={16} />
              <p>이벤트</p>
            </Link>
            <Link to={'/member/support'} className="flex items-center gap-[16px]">
              <CustomerServiceLine color="none" bgColor="none" size={16} />
              <p>고객센터</p>
            </Link>
          </div>
          {user ? (
            <>
              <div className="flex items-center justify-center gap-2 text-babgray-800">
                <Link to={'/member/profile'}>
                  <span>{profileData?.nickname}님</span>
                </Link>
                <div className="flex relative items-center">
                  <Notification2Line color="gray" bgColor="none" size={16} />
                  <div className="w-5 h-5 p-1 left-[60%] bottom-[60%] absolute bg-bab-500 rounded-[10px] inline-flex justify-center items-center">
                    <div className="justify-start text-white text-xs font-normal ">3</div>
                  </div>
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
    </header>
  );
};

export default MemberHeader;
