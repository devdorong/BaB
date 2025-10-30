import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { RiArrowRightLine, RiCloseLine, RiExpandHorizontalSLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MemberIntroModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 화면 크기 확인 (1024px 이상일 때만 표시)
    const checkDevice = () => {
      const isPc = window.innerWidth >= 1024;
      setIsDesktop(isPc);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (!isDesktop) return; // ✅ 모바일이면 그냥 리턴
    const skipIntro = localStorage.getItem('skipMemberIntro');
    if (!skipIntro) setIsOpen(true);
  }, [isDesktop]);

  const handleClose = () => {
    if (dontShowAgain) localStorage.setItem('skipMemberIntro', 'true');
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isDesktop) return null; // ✅ 모바일에선 완전히 렌더 안함

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 모달 본체 */}
          <motion.div
            key="modal"
            className="relative w-full max-w-[600px] h-[85vh] bg-none rounded-2xl overflow-hidden shadow-xl"
            initial={{ y: 80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <RiCloseLine size={20} />
            </button>

            {/* Swiper 슬라이드 */}
            <Swiper
              className="w-full h-full"
              loop={false}
              resistanceRatio={0}
              allowTouchMove={true}
              edgeSwipeDetection={true}
            >
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

                    <RiArrowRightLine className="text-[50px] absolute bottom-[120px] flex" />
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
                    <RiExpandHorizontalSLine className="text-[50px] absolute bottom-[120px] flex" />
                  </div>
                </div>
              </SwiperSlide>

              {/* 마지막 페이지 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?auto=format&fit=crop&q=60&w=400"
                    alt="slide3"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-6 gap-5">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-4xl font-extrabold"
                    >
                      이제 당신의 식사 메이트를 만나보세요!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-lg leading-relaxed max-w-[320px]"
                    >
                      간단한 가입으로 시작해
                      <br />
                      나와 잘 맞는 사람과의 즐거운 식사를 경험해보세요.
                    </motion.p>
                    <motion.button
                      onClick={() => {
                        handleClose();
                        navigate('/member');
                      }}
                      className="bg-bab-500 px-8 py-3 rounded-lg font-semibold mt-4 animate-bounce"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      시작하기
                    </motion.button>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* 하단 체크박스 */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 text-sm text-white  py-2 z-10">
              <input
                id="skipIntro"
                type="checkbox"
                checked={dontShowAgain}
                onChange={e => setDontShowAgain(e.target.checked)}
              />
              <label htmlFor="skipIntro" className="select-none cursor-pointer">
                다음부터 보지 않기
              </label>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberIntroModal;
