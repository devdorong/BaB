import { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { fetchInterestsGrouped } from '../../../lib/interests';
import { fetchRestaurants, type RestaurantTypeRatingAvg } from '../../../lib/restaurants';
import { ReviewCard } from '../../../ui/dorong/ReviewMockCard';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';
import { BlackTag, GrayTag } from '../../../ui/tag';

const FOOD = '음식 종류';

function ReviewsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [restaurants, setRestaurants] = useState<RestaurantTypeRatingAvg[]>([]);
  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  // 사용자 위치
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

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

  // 카테고리 필터 적용
  const filtered =
    selectedCategory === '전체'
      ? restaurants
      : restaurants.filter(item => item.interests?.name === selectedCategory);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = filtered.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const grouped = await fetchInterestsGrouped();
        setInterests(grouped);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
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

  return (
    <div className="w-full bg-bg-bg">
      <div className="w-[1280px] mx-auto flex flex-col gap-8 py-8">
        {/* 타이틀 */}
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold">맛집추천</p>
          <p className="text-babgray-600">진짜 맛집을 찾아보세요</p>
        </div>
        <div className="flex p-[24px] flex-col justify-center gap-[16px] rounded-[20px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.02)]">
          {/* 검색폼,버튼 */}
          <div className="flex w-full justify-between items-center gap-[16px]">
            <div
              onClick={() => document.getElementById('searchInput')?.focus()}
              className="flex w-full items-center pl-[20px] bg-white h-[55px] py-3 px-3 border border-s-babgray rounded-3xl"
            >
              <input
                id="searchInput"
                className="focus:outline-none w-full"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === `Enter`) {
                  }
                }}
                placeholder="맛집 이름이나 음식 종류로 검색하기"
              />
            </div>
            <div className="flex px-[30px] py-[20px] justify-center items-center bg-bab-500 rounded-[18px] cursor-pointer transition hover:bg-bab-600">
              <RiSearchLine size={20} className=" text-white" />
            </div>
          </div>
          <div className="flex gap-[8px]">
            <div className="flex gap-[8px] justify-start ">
              <button
                onClick={() => {
                  setSelectedCategory('전체');
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === '전체'
                    ? 'bg-bab-500 text-white text-[13px]'
                    : 'bg-babgray-100 text-babgray-700 text-[13px]'
                }`}
              >
                전체
              </button>
            </div>

            <div className="flex gap-[8px] justify-start ">
              {(interests[FOOD] ?? []).map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === cat
                      ? 'bg-bab-500 text-white text-[13px]'
                      : 'bg-babgray-100 text-babgray-700 text-[13px]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-start gap-[8px]">
            <BlackTag>거리순</BlackTag>
            <GrayTag>별점순</GrayTag>
            <GrayTag>리뷰순</GrayTag>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[34px]">
          {currentItems.map(r => {
            const category = r.interests?.name ?? '';
            const color = categoryColors[category] || defaultCategoryColor;
            const ratings = r.reviews?.map(v => v.rating_food ?? 0) || [];
            const avgRating =
              ratings.length > 0
                ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
                : 0;
            const distance =
              userPos && r.latitude && r.longitude
                ? getDistance(
                    userPos.lat,
                    userPos.lng,
                    parseFloat(r.latitude),
                    parseFloat(r.longitude),
                  )
                : '';

            return (
              <div key={r.id} onClick={() => navigate(`/member/reviews/${r.id}`)}>
                <ReviewCard
                  key={r.id}
                  restaurantId={r.id}
                  name={r.name}
                  category={r.interests?.name ?? ''}
                  img={r.thumbnail_url}
                  review={`리뷰 ${r.reviews.length}개`}
                  storeintro={r.storeintro ?? ''}
                  rating={avgRating ?? 0}
                  distance={distance}
                  tagBg={color.bg}
                  tagText={color.text}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="p-2  bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
          >
            <RiArrowLeftSLine size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`p-2 py-0 rounded hover:bg-bab hover:text-white ${
                currentPage === idx + 1 ? 'text-bab' : 'bg-bg-bg'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="p-2 bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
          >
            <RiArrowRightSLine size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewsPage;
