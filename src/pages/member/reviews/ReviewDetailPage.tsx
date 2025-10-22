import { useEffect, useState } from 'react';
import {
  RiArrowLeftLine,
  RiHeart3Fill,
  RiMapPinLine,
  RiMessageLine,
  RiStarFill,
} from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import InfoSection from '../../../components/member/InfoSection';
import ReviewItem from '../../../components/member/ReviewItem';
import WriteReview from '../../../components/member/WriteReview';
import { fetchInterestsGrouped } from '../../../lib/interests';
import {
  checkFavoriteRest,
  fetchRestaurantDetailId,
  fetchRestaurantReviews,
  fetchRestaurants,
  getFavoriteCount,
  type RestaurantsDetailType,
  type RestaurantTypeRatingAvg,
  type ReviewWithPhotos,
} from '../../../lib/restaurants';
import { toggleFavorite } from '../../../services/RestReviewService';
import { ButtonFillLG, ButtonLineLg } from '../../../ui/button';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';
import { InterestBadge } from '../../../ui/tag';

type TabKey = 'review' | 'info';
const FOOD = '음식 종류';

function ReviewDetailPage() {
  const navigate = useNavigate();
  const [writeOpen, setWriteOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantsDetailType | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantTypeRatingAvg[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [reviews, setReviews] = useState<ReviewWithPhotos[]>([]);

  const goBack = () => {
    if (window.history && window.history.length > 1) navigate(-1);
    else navigate('/'); // 히스토리 없을 때 대체 경로
  };

  const [tab, setTab] = useState<TabKey>('review');

  const base = 'group relative px-4 py-2 pb-3 transition-colors outline-none';
  const active = 'text-bab-500';
  const inactive = 'text-babgray-600 hover:text-bab-500 focus-visible:text-bab-500';

  const underlineClass = (isActive: boolean) =>
    [
      'pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0',
      'h-[1px] w-full max-w-[112px] rounded-full transition-opacity',
      isActive ? 'bg-bab-500 opacity-100' : 'opacity-0',
      // 포커스일 때만 나타남 (호버는 아님)
      'group-focus-visible:opacity-100 group-focus-visible:bg-bab-500',
    ].join(' ');

  // 카테고리
  useEffect(() => {
    const restaurantLoad = async () => {
      setLoading(true);
      try {
        const [grouped, restaurantData] = await Promise.all([
          fetchInterestsGrouped(),
          fetchRestaurants(),
        ]);
        setInterests(grouped);
        setRestaurants(restaurantData);
      } catch (err) {
        // console.log(err);
      } finally {
        setLoading(false);
      }
    };
    restaurantLoad();
  }, []);

  // 현재위치
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      err => {
        console.error('위치 정보를 가져올 수 없습니다:', err);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  // 현재 위치 기준으로 거리 계산
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // 단위 변환 (1km 미만이면 m, 그 이상이면 km)
    return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
  };

  // 거리 계산
  const distance =
    userPos && restaurant?.latitude && restaurant?.longitude
      ? getDistance(
          userPos.lat,
          userPos.lng,
          parseFloat(restaurant.latitude),
          parseFloat(restaurant.longitude),
        )
      : '';

  useEffect(() => {
    const loadFavorite = async () => {
      if (!restaurant) return;
      const count = await getFavoriteCount(restaurant.id);
      const isFav = await checkFavoriteRest(restaurant.id);

      setFavoriteCount(count);
      setIsFavorite(isFav);
      setLoading(false);
    };
    loadFavorite();
  }, [restaurant?.id]);

  // 별점 계산
  useEffect(() => {
    const loadRestaurant = async () => {
      if (!id) return;

      const detail = await fetchRestaurantDetailId(id);
      if (!detail) return;

      // 리뷰 목록 따로 불러오기
      const reviewData = await fetchRestaurantReviews(Number(id));
      setReviews(reviewData);

      // 평균계산
      const ratings = reviewData.map(r => r.rating_food ?? 0);
      const avg =
        ratings.length > 0 ? ratings.reduce((sum, val) => sum + val, 0) / ratings.length : 0;

      setRestaurant({
        ...detail,
        send_avg_rating: Math.round(avg * 10) / 10,
      });
    };

    loadRestaurant();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!restaurant) return;

    const newState = await toggleFavorite(restaurant.id);
    setIsFavorite(newState);
    const count = await getFavoriteCount(restaurant.id);
    setFavoriteCount(count);
  };

  // 리뷰 등록 후 새로고침
  const loadReviews = async () => {
    const data = await fetchRestaurantReviews(restaurant!.id);
    setReviews(data);

    const avg =
      data.length > 0 ? data.reduce((sum, r) => sum + (r.rating_food ?? 0), 0) / data.length : 0;

    const reviewCount = data.length;

    setReviews(data);
    setRestaurant(prev =>
      prev
        ? {
            ...prev,
            send_avg_rating: Math.round(avg * 10) / 10,
            reviews: [{ count: reviewCount }],
          }
        : prev,
    );
  };

  return (
    <div className="w-full">
      <div className="max-w-[1280px] mx-auto py-[50px]">
        {/* 가게사진 */}
        <section className="relative rounded-3xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={goBack}
            aria-label="뒤로 가기"
            className="absolute left-4 top-4 z-10 w-10 h-10 rounded-full
                       bg-white/95 backdrop-blur border border-black/10
                       shadow-[0_4px_4px_rgba(0,0,0,0.02)]
                       inline-flex items-center justify-center
                       "
          >
            <RiArrowLeftLine className="text-[18px]" />
          </button>
          {restaurant?.thumbnail_url ? (
            <>
              <img
                src={restaurant?.thumbnail_url}
                alt="가게 사진"
                className="w-full h-[400px] object-cover"
              />
            </>
          ) : (
            <div className="w-full h-[400px] object-cover bg-babgray-200"></div>
          )}

          {/* 헤더 정보 박스 */}
          <div className="px-5 py-4 md:px-8 md:py-6 bg-white rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex item-center justify-center gap-[14px] mb-[4px]">
                <h1 className="text-[30px] font-semibold ">{restaurant?.name}</h1>
                {restaurant?.interests?.category === FOOD && (
                  <InterestBadge
                    bgColor={
                      categoryColors[restaurant.interests.name]?.bg || defaultCategoryColor.bg
                    }
                    textColor={
                      categoryColors[restaurant.interests.name]?.text || defaultCategoryColor.text
                    }
                  >
                    {restaurant.interests.name}
                  </InterestBadge>
                )}
              </div>
              <div className="flex relative items-center gap-2 text-babgray-700">
                <div
                  onClick={handleToggleFavorite}
                  className="absolute cursor-pointer bottom-[70px] right-[5px] text-[50px]"
                >
                  {isFavorite ? (
                    <RiHeart3Fill className="text-[#FF5722]" />
                  ) : (
                    <RiHeart3Fill className="text-babgray-600" />
                  )}
                </div>
                {/* <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.02)] border border-black/5">
                  <RiShareLine className="text-[18px]" />
                </button> */}
              </div>
            </div>

            {/* 평점/리뷰/거리 */}
            <div className="mt-2 flex flex-col flex-wrap items-start gap-2 text-babgray-700">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <RiStarFill className="text-[#FACC15] text-[16px]" />
                  <span className="w-[37px] text-[14px]">{restaurant?.send_avg_rating ?? 0}점</span>
                </div>
                <div className="flex items-center gap-1">
                  <RiMessageLine className="text-[16px]" />
                  <span className="w-[37px] whitespace-nowrap text-[14px]">
                    리뷰 {restaurant?.reviews?.[0]?.count ?? 0}개
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <RiMapPinLine className="text-[#FF5722] text-[18px]" />
                <span className="text-[14px]">
                  {restaurant?.address} · {distance}
                </span>
              </div>
            </div>

            {/* 한 줄 소개 */}
            <p className="my-4 text-[16px] text-babgray-600 line-clamp-2">
              {restaurant?.storeintro}
            </p>

            {/* 액션 버튼들 */}
            <div className="mt-4 flex flex-wrap gap-5">
              <ButtonFillLG
                style={{ fontWeight: 500, borderRadius: '24px' }}
                onClick={() => setWriteOpen(true)}
              >
                리뷰 작성하기
              </ButtonFillLG>
              <ButtonLineLg style={{ fontWeight: 500, borderRadius: '24px' }}>
                전화하기
              </ButtonLineLg>
              <ButtonLineLg style={{ fontWeight: 500, borderRadius: '24px' }}>길찾기</ButtonLineLg>
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <nav
          className="mt-6 flex items-center gap-3 border-b border-babgray-150"
          role="tablist"
          aria-label="상세 탭"
        >
          {/* 리뷰 */}
          <button
            role="tab"
            aria-selected={tab === 'review'}
            onClick={() => setTab('review')}
            className={`${base} ${tab === 'review' ? active : inactive}`}
          >
            <div className="flex gap-2">
              리뷰
              <div>{restaurant?.reviews?.[0]?.count ?? 0}</div>
            </div>
            <span className={underlineClass(tab === 'review')} />
          </button>

          {/* 정보 */}
          <button
            role="tab"
            aria-selected={tab === 'info'}
            onClick={() => setTab('info')}
            className={`${base} ${tab === 'info' ? active : inactive}`}
          >
            정보
            <span className={underlineClass(tab === 'info')} />
          </button>
        </nav>

        {/* 탭 콘텐츠 */}
        {tab === 'review' ? (
          <section className="mt-10 space-y-4">
            {restaurant && <ReviewItem restaurantId={restaurant.id} reviews={reviews} />}
          </section>
        ) : (
          <InfoSection
            restPhone={restaurant?.phone}
            restAddress={restaurant?.address}
            opentime={restaurant?.opentime}
            closetime={restaurant?.closetime}
            closeday={restaurant?.closeday}
            lat={restaurant?.latitude}
            lng={restaurant?.longitude}
          />
        )}
      </div>
      {restaurant && (
        <WriteReview
          restaurantId={restaurant.id}
          open={writeOpen}
          onClose={() => setWriteOpen(false)}
          onSubmit={data => {
            console.log('리뷰 제출', data);
          }}
          onSuccess={() => loadReviews()}
        />
      )}
    </div>
  );
}

export default ReviewDetailPage;
