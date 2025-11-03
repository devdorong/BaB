import AllCategory from '@/components/member/AllCategory';
import { ReviewCard } from '@/ui/dorong/ReviewMockCard';
import { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { fetchInterestsGrouped } from '../../../lib/interests';
import { fetchFavoriteRestaurants, type RestaurantsType } from '../../../lib/restaurants';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';

const FOOD = '음식 종류';

function FavoritePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | number>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurants, setRestaurants] = useState<RestaurantsType[]>([]);
  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const itemsPerPage = 6;

  // 카테고리
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      try {
        const favoriteList = await fetchFavoriteRestaurants();
        setRestaurants(favoriteList);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  // // 카테고리 필터 적용
  // const filtered =
  //   selectedCategory === '전체'
  //     ? restaurants
  //     : restaurants.filter(item => item.interests?.name === selectedCategory);

  // 카테고리 필터 적용
  let filtered = restaurants.filter(item => {
    // 카테고리 필터
    const matchCategory = selectedCategory === '전체' || item.interests?.name === selectedCategory;
    return matchCategory;
  });

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
        // console.error('위치 정보를 가져올 수 없습니다:', err);
        setUserPos({ lng: 128.59396682562848, lat: 35.86823232723134 });
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

  // 평균 평점 계산
  const getAvgRating = (r: { reviews?: { rating_food?: number | null }[] }) => {
    const ratings = r.reviews?.map(v => v.rating_food ?? 0) || [];
    return ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
      : 0;
  };

  return (
    <div id="root" className="flex flex-col min-h-screen bg-bg-bg">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
          {/* 프로필 헤더 링크 */}
          <div className="hidden lg:flex sm:text-base items-center py-[15px]">
            <div
              onClick={() => navigate('/member/profile')}
              className=" cursor-pointer hover:text-babgray-900 text-babgray-600 text-[17px]"
            >
              프로필
            </div>
            <div className="text-babgray-600 px-[5px] text-[17px]">{'>'}</div>
            <div className="text-bab-500 text-[17px]">즐겨찾는 식당</div>
          </div>
          <div className="mx-auto flex flex-col gap-4 py-4 lg:gap-8 lg:py-8">
            {/* 타이틀 */}
            <div className="flex flex-col gap-1">
              <p className="text-[24px] lg:text-3xl font-bold">즐겨찾는 식당</p>
              <p className="text-babgray-600 text-[16px]">
                내가 즐겨찾는 식당을 한눈에 확인해보세요.
              </p>
            </div>

            {/* 검색폼,버튼 */}
            <div>
              {/* 데스크탑 */}
              <div className="hidden lg:flex flex-wrap gap-2 justify-start">
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

                {(interests[FOOD] ?? []).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-[13px] ${
                      selectedCategory === cat
                        ? 'bg-bab-500 text-white'
                        : 'bg-babgray-100 text-babgray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 모바일·태블릿용 드롭다운 */}
              {/* <div className="lg:hidden flex justify-start">
                <select
                  value={selectedCategory}
                  onChange={e => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none text-center p-2 rounded-full border border-babgray-200 text-babgray-700 text-sm focus:border-bab-500 focus:ring-1 focus:ring-bab-500  "
                >
                  <option value="전체">전체</option>
                  {(interests[FOOD] ?? []).map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="lg:hidden flex justify-start">
                <AllCategory
                  value={selectedCategory}
                  onChange={v => {
                    setSelectedCategory(v);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {currentItems.length === 0 && (
              <div className="flex justify-center items-center h-64 text-babgray-500 text-lg">
                즐겨찾는 식당이 없습니다.
              </div>
            )}

            {currentItems.length > 0 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
                  {currentItems.map(r => {
                    const category = r.interests?.name ?? '';
                    const color = categoryColors[category] || defaultCategoryColor;
                    const avgRating = getAvgRating(r as any);
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
                      <ReviewCard
                        onClick={() => navigate(`/member/reviews/${r.id}`)}
                        key={r.id}
                        restaurantId={r.id}
                        name={r.name}
                        category={r.interests?.name ?? ''}
                        img={r.thumbnail_url}
                        review={`리뷰 ${r.reviews?.[0]?.count ?? 0}개`}
                        storeintro={r.storeintro ?? ''}
                        rating={r.send_avg_rating ?? 0}
                        distance={distance}
                        tagBg={color.bg}
                        tagText={color.text}
                      />
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FavoritePage;
