// MainReview.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { fetchAllReviewData, type MyReviewData } from '@/lib/myreviews';
import MyreviewCard from '@/ui/jy/MyReviewCard';
import { categoryColors } from '@/ui/jy/categoryColors';

export default function MainReview() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<MyReviewData[]>([]);

  // 실제 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllReviewData();
      setReviews(data || []);
    };
    fetchData();
  }, []);

  // UI 카드용 데이터 변환
  const reviewCards = useMemo(() => {
    return reviews.slice(0, 14).map(r => {
      const category =
        r.restaurants?.restaurants_category_id_fkey?.name ?? r.restaurants?.category ?? '기타';

      // 카테고리에 맞는 색상 매핑 (없으면 기본 색상)
      const colors = categoryColors[category] || {
        bg: 'bg-babgray-100',
        text: 'text-babgray-700',
      };

      return {
        imageUrl: r.restaurants?.thumbnail_url ?? '',
        name: r.restaurants?.name ?? '이름 없음',
        rating: r.rating_food ?? 0,
        reviewCount: r.restaurants?.reviews?.[0]?.count?.toString() ?? '0',
        comment: r.comment ?? '',
        category,
        tagBg: colors.bg,
        tagText: colors.text,
        review_photos: r.review_photos ?? [],
      };
    });
  }, [reviews]);

  return (
    <section className="relative w-full">
      {/* 상단 타이틀 */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          최근 올라온 리뷰
        </h2>
      </div>

      {/* 리뷰 슬라이드 */}
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={16}
        speed={450}
        breakpoints={{
          640: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 24 },
        }}
        watchOverflow
        className="!px-1"
      >
        {reviewCards.map((card, idx) => (
          <SwiperSlide key={idx} className="!h-auto">
            <MyreviewCard {...card} onClick={() => navigate(`/member/reviews/${card.name}`)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
