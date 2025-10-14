import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { Profile } from '../types/bobType';
import { getProfile } from '../lib/propile';

function IndexPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  const isPartner = profileData?.role === 'partner';
  const isAdmin = profileData?.role === 'admin';

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
  }, [user?.id]);
  const handleClickPartner = () => {
    if (isPartner || isAdmin) {
      navigate('/partner');
    } else {
      navigate('/partner/login');
    }
  };
  const handleClickMember = () => {
    navigate('/member');
  };

  return (
    <div className="flex w-[calc(100vw/0.9)] h-[calc(100vh/0.9)] overflow-hidden">
      <div className="flex w-[50%] relative group overflow-hidden">
        <img
          className="w-full h-full object-cover transition group-hover:blur-sm outline-none group-hover:scale-105 overflow-hidden"
          src="/unsplash_ZgREXhl8ER0.png"
          alt="파트너 이미지"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300"></div>
        <div className="flex flex-col items-center gap-[18px] text-white absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <span className="text-8xl font-['Impact']">PARTNER</span>

          <button
            onClick={handleClickPartner}
            className="w-64 h-14 px-3.5 py-2.5  rounded-lg inline-flex justify-center items-center gap-2.5 border border-white cursor-pointer hover:bg-bab-500 hover:border-bab-500"
          >
            <div className="justify-start text-white text-base font-bold font-['Inter']">
              파트너로 함께하기
            </div>
          </button>
        </div>
      </div>
      <div className="flex w-[50%] relative group overflow-hidden">
        <img
          className="w-full h-full object-cover transition group-hover:blur-sm outline-none group-hover:scale-105 "
          src="/membermain.png"
          alt="멤버 이미지"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-300"></div>
        <div className="flex flex-col items-center gap-[18px] text-white absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] ">
          <span className="text-8xl font-['Impact']">MEMBER</span>

          <button
            onClick={handleClickMember}
            className="w-64 h-14 px-3.5 py-2.5  rounded-lg inline-flex justify-center items-center gap-2.5 border border-white cursor-pointer hover:bg-bab-500 hover:border-bab-500"
          >
            <div className="justify-start text-white text-base font-bold font-['Inter']">
              회원으로 즐기기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
