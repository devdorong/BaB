// MainReview.tsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import RestaurantCard from '../../ui/jy/RestaurantCard';
import { mockReviews } from '../../types/review'; // ✅ 우리가 만든 목업데이터 import
import RestaurantMockUpCard from '../../ui/dorong/RestaurantMockUpCard';

export default function MainReview() {
  const navigate = useNavigate();

  // mockReviews → RestaurantCard 형식으로 변환
  const items = useMemo(
    () => [
      ...mockReviews.slice(0, 10).map(r => ({
        imageUrl: r.img,
        name: r.name,
        rating: r.rating,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        location: r.category,
        distanceKm: parseFloat(r.distance),
        reviewSnippet: r.review,
        likeCount: Math.floor(Math.random() * 100),
        category: r.category,
        tagBg: r.tagBg!,
        tagText: r.tagText!,
      })),
      { type: 'more' as const },
    ],
    [],
  );

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">최근 올라온 리뷰</h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={4}
        slidesPerGroup={4}
        spaceBetween={24}
        speed={450}
        breakpoints={{
          0: { slidesPerView: 1.1, slidesPerGroup: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 24 },
        }}
        watchOverflow
        className="!px-1"
      >
        {items.map((it, idx) => (
          <SwiperSlide key={idx} className="!h-auto">
            {'type' in it ? (
              /* 전체보기 카드 */
              <div className="h-full min-h-[360px] flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => navigate('/member/reviews')}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                >
                  <span className="w-16 h-16 rounded-full border border-gray-200 bg-white flex items-center justify-center">
                    <RiArrowRightLine className="w-6 h-6 text-gray-800" />
                  </span>
                  <span className="text-sm text-gray-600">전체보기</span>
                </button>
              </div>
            ) : (
              <div onClick={() => navigate('/member/reviews/detail')}>
                {/* 기존 RestaurantCard → RestaurantMockUpCard */}
                <RestaurantMockUpCard {...(it as any)} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
