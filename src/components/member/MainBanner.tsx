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
// import type { Banner } from '../../types/bobType';

const MainBanner = () => {
  const [bannerImgs, setBannerImgs] = useState<Banner[] | null>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getBannerData = async () => {
      const { data, error } = await supabase.from('banners').select('*');
      if (error) {
        throw new Error(`배너 이미지를 불러오지 못했습니다. : ${error}`);
      }
      setBannerImgs(data);
    };
    getBannerData();
  }, []);

  return (
    <div className="relative">
      <div className="w-[1280px] h-[320px] ">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
        >
          {bannerImgs?.map(item => (
            <SwiperSlide key={item.id}>
              <div className="w-[1280px] h-[320px] overflow-hidden">
                <img
                  src={item.thumbnail_url}
                  alt={item.alt || ''}
                  className="w-full h-full object-cover  rounded-b-[20px] cursor-pointer"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="absolute left-[50%] z-[100] translate-x-[-50%] translate-y-[-50%]">
        <button onClick={()=>navigate("/member/posts")} className="flex flex-col items-center justify-center gap-[20px] w-[200px] h-[200px] bg-gradient-to-br from-bab-400 to-bab-600 text-white rounded-[50%] border-[5px] border-bab-300">
          <RiRestaurantFill size={48} />
          <span className="text-2xl ">빠른매칭</span>
        </button>
      </div>
    </div>
  );
};

export default MainBanner;
