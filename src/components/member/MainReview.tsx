// MainReview.tsx
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
import RestaurantCard from '../../ui/jy/RestaurantCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const dummy = Array.from({ length: 10 }).map((_, i) => ({
  imageUrl: '/sample.jpg',
  name: '미슐랭 파스타 하우스',
  rating: 4.8,
  reviewCount: 127,
  location: '강남구 청담동',
  distanceKm: 1.2,
  reviewSnippet:
    '정말 맛있는 파스타집이에요! 특히 트러플 크림 파스타가 최고였습니다. 분위기도 로맨틱…',
  likeCount: 24 + i,
}));

export default function MainReview() {
  const navigate = useNavigate();

  // 마지막 칸에 전체보기 카드 추가
  const items = useMemo(() => [...dummy, { type: 'more' as const }], []);

  return (
    <section className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">최근 올라온 리뷰</h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        // 한 화면에 4장, 페이지 단위로 4장씩 이동
        slidesPerView={4}
        slidesPerGroup={4}
        spaceBetween={24}
        speed={450}
        // 반응형: 화면이 좁을 때 장수 조정
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
              /* 전체보기 카드 (마지막 칸) */
              <div
                className="
                  h-full min-h-[360px] rounded-3xl bg-none
                  
                  flex items-center justify-center
                "
              >
                <button
                  type="button"
                  onClick={() => navigate('/member/reviews')}
                  className="
                    group flex flex-col items-center gap-2 focus:outline-none
                  "
                >
                  <span
                    className="
                      w-16 h-16 rounded-full border border-gray-200 bg-white
                      flex items-center justify-center
                      
                    "
                    aria-hidden
                  >
                    <RiArrowRightLine className="w-6 h-6 text-gray-800" />
                  </span>
                  <span className="text-sm text-gray-600">전체보기</span>
                </button>
              </div>
            ) : (
              // RestaurantCard가 li를 반환하더라도 SwiperSlide 내부에 넣어도 무방
              <div onClick={() => navigate('/member/reviews/detail')}>
                <RestaurantCard {...(it as any)} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
