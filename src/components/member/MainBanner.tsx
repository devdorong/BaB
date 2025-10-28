import { useEffect, useState } from 'react';
import { RiRestaurantFill } from 'react-icons/ri';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { supabase } from '../../lib/supabase';
import type { Banner } from '../../types/bobType';
import { useNavigate } from 'react-router-dom';

import Modal from '@/ui/sdj/Modal';
import { useModal } from '@/ui/sdj/ModalState';
import { useAuth } from '@/contexts/AuthContext';
import { quickJoinMatching } from '@/services/matchingService';
import { toast } from 'sonner';

import '../../css/buttonStyles.css';


const MainBanner = () => {
  const [bannerImgs, setBannerImgs] = useState<Banner[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { modal, closeModal, openModal } = useModal();

  useEffect(() => {
    const getBannerData = async () => {
      try {
        const { data, error } = await supabase.from('banners').select('*');
        if (error) throw new Error(`배너 이미지를 불러오지 못했습니다. : ${error.message}`);
        setBannerImgs(data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getBannerData();
  }, []);

  const handleMatchingClick = async () => {
    if (!user) {
      openModal('로그인 확인', '로그인이 필요합니다.', '닫기', '로그인', () =>
        navigate('/member/login'),
      );
      return;
    }
    openModal(
      '빠른매칭',
      '해당 정보의 매칭에 참가하시겠습니까?',
      '닫기',
      '참가하기',
      // 참가하기 버튼 클릭시 실행항 함수
      async () => {
        try {
          const result = await quickJoinMatching(user.id);
          if (result.success) {
            // console.log(`매칭(${result.joinedMatchingId})에 자동 참여되었습니다.`);
          } else {
            // console.log(result.message);
          }
        } catch (error) {
          // console.log('퀵매칭 오류', error);
        } finally {
          closeModal();
        }
      },
    );
  };

  if (isLoading) {
    return (
      <div className="relative flex justify-center">
        <div className="w-full max-w-[1280px] h-[180px] sm:h-[240px] md:h-[300px] lg:h-[320px] rounded-b-[20px] bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">배너 로딩 중...</span>
        </div>
        <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[50%] z-20 border-[10px] rounded-[50%] bg-white border-bg-bg ">
          <button
            onClick={() => navigate('/member/matching')}
            className="flex flex-col items-center justify-center gap-3 w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] bg-gradient-to-br from-bab-400 to-bab-600 text-white rounded-full border-[5px] border-bab-300 shadow-md "
          >
            <RiRestaurantFill size={40} className="sm:size-[48px]" />
            <span className="text-lg sm:text-xl md:text-2xl">빠른매칭</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center">
      {/* 배너 Swiper */}
      <div
        className="w-full max-w-[1280px] h-[180px] sm:h-[240px] md:h-[300px] lg:h-[320px] rounded-b-[20px] overflow-hidden cursor-pointer"
        onClick={() => navigate('/member/events')}
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          centeredSlides
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
        >
          {bannerImgs?.map(item => (
            <SwiperSlide key={item.id}>
              <img
                src={item.thumbnail_url}
                alt={item.alt || ''}
                className="w-full h-full object-cover rounded-b-[20px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 중앙 버튼 (하단 절반 걸치게) */}
      <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[50%] z-20 border-[4px] rounded-[50%] bg-white border-bg-bg sm:border-[10px]">
        <button

          onClick={handleMatchingClick}
             className="flex flex-col items-center justify-center gap-3 
        w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] 
        bg-gradient-to-br from-bab-400 to-bab-600 
        text-white rounded-full shadow-md custom-btn"

        >
          <RiRestaurantFill size={40} className="sm:size-[48px]" />
          <span className="text-lg sm:text-xl md:text-2xl">빠른매칭</span>
        </button>
      </div>
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
        />
      )}
    </div>
  );
};

export default MainBanner;
