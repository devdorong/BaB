import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { Profile } from '../types/bobType';
import { getProfile } from '../lib/propile';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

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
    <div className="w-[calc(100vw/0.9)] h-[calc(100vh/0.9)] overflow-hidden">
      {/* 웹용 화면 */}
      <div className="hidden lg:flex w-[calc(100vw/0.9)] h-[calc(100vh/0.9)]">
        {/* 파트너 */}
        <div className=" w-[50%] relative group overflow-hidden">
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
        {/* 멤버 */}
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
      {/* 모바일용 화면 */}
      <div className="flex lg:hidden w-[calc(100vw/0.9)] h-[calc(100vh/0.9)]">
        <Swiper className="w-[calc(100vw/0.9)] h-[calc(100vh/0.9)]">
          {/* STEP 1~2 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img src="/membermain.png" alt="slide1" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-6 gap-6">
                <h2 className="text-3xl font-extrabold">STEP 1 · 회원가입 & 프로필 설정</h2>
                <p className="text-base leading-relaxed max-w-[340px]">
                  간단한 회원가입으로 서비스를 시작해요.
                  <br />
                  닉네임, 관심사, 선호 메뉴, 위치를 등록하면
                  <br />내 취향을 반영한 맞춤형 매칭 준비가 돼요.
                </p>

                <h2 className="text-3xl font-extrabold mt-8">STEP 2 · 매칭 탐색 & 조건 설정</h2>
                <p className="text-base leading-relaxed max-w-[340px]">
                  위치 기반으로 가까운 사람을 쉽게 찾아요.
                  <br />
                  메뉴 기반으로 비슷한 취향의 사람과 연결되고,
                  <br />
                  이벤트나 쿠폰으로 다양한 매칭 기회를 얻을 수 있어요.
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* STEP 3~4 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img
                src="/unsplash_ZgREXhl8ER0.png"
                alt="slide2"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-6 gap-6">
                <h2 className="text-3xl font-extrabold">STEP 3 · 매칭 확정 & 상호작용</h2>
                <p className="text-base leading-relaxed max-w-[340px]">
                  매칭 신청과 수락으로 만남이 성사돼요.
                  <br />
                  실시간 채팅으로 약속을 조율하며
                  <br />
                  편하게 대화하고 불안함을 줄일 수 있어요.
                </p>

                <h2 className="text-3xl font-extrabold mt-8">STEP 4 · 식사 후 리뷰 & 리워드</h2>
                <p className="text-base leading-relaxed max-w-[340px]">
                  식사 후 함께한 상대방을 리뷰하면
                  <br />
                  포인트와 리워드를 얻을 수 있어요.
                  <br />
                  좋은 경험은 신뢰도를 높이고, 다음 매칭을 기대하게 돼요.
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* 시작하기 페이지 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?auto=format&fit=crop&q=60&w=400"
                alt="slide3"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-6 gap-5">
                <h2 className="text-4xl font-extrabold">이제 당신의 식사 메이트를 만나보세요!</h2>
                <p className="text-lg leading-relaxed max-w-[320px]">
                  간단한 가입으로 시작해
                  <br />
                  나와 잘 맞는 사람과의 즐거운 식사를 경험해보세요.
                </p>
                <button
                  onClick={() => navigate('/member')}
                  className="bg-bab-500 px-8 py-3 rounded-lg font-semibold mt-4 animate-bounce"
                >
                  시작하기
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default IndexPage;
