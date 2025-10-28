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
import '../../css/buttonStyles.css';

const MainBanner = () => {
  const [bannerImgs, setBannerImgs] = useState<Banner[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <div className="relative flex justify-center">
        <div className="w-full max-w-[1280px] h-[180px] sm:h-[240px] md:h-[300px] lg:h-[320px] rounded-b-[20px] bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-500">배너 로딩 중...</span>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] z-20">
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
      <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[50%] z-20 border-[10px] rounded-[50%] bg-white border-bg-bg ">
        <button
          onClick={() => navigate('/member/matching')}
          className="flex flex-col items-center justify-center gap-3 
        w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px] 
        bg-gradient-to-br from-bab-400 to-bab-600 
        text-white rounded-full shadow-md custom-btn"
        >
          <RiRestaurantFill size={40} className="sm:size-[48px]" />
          <span className="text-lg sm:text-xl md:text-2xl">빠른매칭</span>
        </button>
      </div>
    </div>
  );
};

export default MainBanner;
