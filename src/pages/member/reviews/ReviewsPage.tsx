import AllCategory from '@/components/member/AllCategory';
import SortCategory from '@/components/member/SortCategory';
import ReviewCardSkeleton from '@/ui/dorong/ReviewCardSkeleton';
import ReviewsPageSkeleton from '@/ui/jy/SkeletonRestaurantCard';
import { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { fetchInterestsGrouped } from '../../../lib/interests';
import { fetchRestaurants, type RestaurantTypeRatingAvg } from '../../../lib/restaurants';
import { ReviewCard } from '../../../ui/dorong/ReviewMockCard';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';

const FOOD = '음식 종류';

type SortType = 'distance' | 'rating' | 'review';

function ReviewsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | number>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<SortType>('distance');
  const itemsPerPage = 6;
  const [restaurants, setRestaurants] = useState<RestaurantTypeRatingAvg[]>([]);
  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [displayedSearch, setDisplayedSearch] = useState('');

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
        // console.error('위치 정보를 가져올 수 없습니다:', err);
        setUserPos({ lng: 128.59396682562848, lat: 35.86823232723134 });
      },
      { enableHighAccuracy: true },
    );
  }, []);

  // 현재 위치 기준으로 거리 계산
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 거리를 문자열로 포맷팅
  const formatDistance = (distance: number): string => {
    return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
  };

  // 평균 평점 계산
  const getAvgRating = (r: RestaurantTypeRatingAvg): number => {
    const ratings = r.reviews?.map(v => v.rating_food ?? 0) || [];
    return ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
      : 0;
  };

  // 검색 실행
  const handleSearch = () => {
    setDisplayedSearch(search);
    setCurrentPage(1);
  };

  // 카테고리 필터 적용
  let filtered = restaurants.filter(item => {
    // 카테고리 필터
    const matchCategory = selectedCategory === '전체' || item.interests?.name === selectedCategory;

    // 검색 필터 (맛집 이름 또는 음식 종류) - displayedSearch 사용
    const matchSearch =
      !displayedSearch ||
      item.name.toLowerCase().includes(displayedSearch.toLowerCase()) ||
      (item.interests?.name ?? '').toLowerCase().includes(displayedSearch.toLowerCase());

    return matchCategory && matchSearch;
  });

  // 정렬 적용
  filtered = filtered.sort((a, b) => {
    if (sortType === 'distance') {
      if (!userPos || !a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
      const distA = getDistance(
        userPos.lat,
        userPos.lng,
        parseFloat(a.latitude),
        parseFloat(a.longitude),
      );
      const distB = getDistance(
        userPos.lat,
        userPos.lng,
        parseFloat(b.latitude),
        parseFloat(b.longitude),
      );
      return distA - distB;
    } else if (sortType === 'rating') {
      const ratingA = getAvgRating(a);
      const ratingB = getAvgRating(b);
      return ratingB - ratingA; // 높은 평점부터
    } else if (sortType === 'review') {
      const reviewCountA = a.reviews?.length || 0;
      const reviewCountB = b.reviews?.length || 0;
      return reviewCountB - reviewCountA; // 리뷰 많은 순
    }
    return 0;
  });

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = filtered.slice(startIdx, endIdx);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading || restaurants.length === 0 || Object.keys(interests).length === 0) {
    <ReviewsPageSkeleton />;
  }

  return (
    <div id="root" className="flex flex-col min-h-screen bg-bg-bg">
      <div className="w-full flex justify-center">
        <div className="w-[1280px] mx-auto flex flex-col px-4 sm:px-6 lg:px-8 xl:px-0 gap-4 py-4 lg:gap-8 lg:py-8">
          {/* 타이틀 */}
          <div className="flex flex-col gap-1">
            <p className="text-[24px] lg:text-3xl font-bold">맛집추천</p>
            <p className="text-babgray-600 text-[16px]">진짜 맛집을 찾아보세요</p>
          </div>
          <div className="flex w-full  p-6 flex-col justify-center gap-4 sm:gap-6 rounded-[20px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.02)]">
            {/* 검색폼,버튼 */}
            <div className="flex w-full items-center gap-[16px]">
              <div
                onClick={() => document.getElementById('searchInput')?.focus()}
                className="flex flex-1 items-center pl-[20px] bg-white h-[55px] py-3 px-3 border border-s-babgray rounded-3xl"
              >
                <input
                  id="searchInput"
                  className="focus:outline-none w-full text-[14px] lg:text-base"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="원하는 음식이나 가게를 검색해보세요"
                />
              </div>
              <div
                onClick={handleSearch}
                className="flex px-5 py-4 justify-center items-center bg-bab-500 rounded-[18px] cursor-pointer transition hover:bg-bab-600"
              >
                <RiSearchLine size={20} className=" text-white" />
              </div>
            </div>

            {/* 검색폼,버튼 */}
            <div className="flex flex-col gap-4">
              {/* 데탑 */}
              <div className="hidden lg:flex flex-wrap gap-2 justify-start sm:justify-start">
                <div className="flex gap-[8px] justify-start ">
                  <button
                    onClick={() => {
                      setSelectedCategory('전체');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2.5 rounded-full text-sm ${
                      selectedCategory === '전체'
                        ? 'bg-bab-500 text-white'
                        : 'bg-babgray-100 text-babgray-700 hover:bg-babgray-200'
                    }`}
                  >
                    전체
                  </button>
                </div>

                {(interests[FOOD] ?? []).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm ${
                      selectedCategory === cat
                        ? 'bg-bab-500 text-white'
                        : 'bg-babgray-100 text-babgray-700 hover:bg-babgray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 모바일·태블릿용 드롭다운 */}
              <div className="flex gap-4 justify-start items-start">
                <div className="lg:hidden flex justify-start">
                  <AllCategory
                    value={selectedCategory}
                    onChange={v => {
                      setSelectedCategory(v);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="flex justify-start gap-[8px]">
                  <SortCategory sortType={sortType} setSortType={setSortType} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ReviewCardSkeleton key={i} />)
              : currentItems.length > 0 &&
                currentItems.map(r => {
                  const category = r.interests?.name ?? '';
                  const color = categoryColors[category] || defaultCategoryColor;
                  const avgRating = getAvgRating(r);
                  const distanceNum =
                    userPos && r.latitude && r.longitude
                      ? getDistance(
                          userPos.lat,
                          userPos.lng,
                          parseFloat(r.latitude),
                          parseFloat(r.longitude),
                        )
                      : 0;
                  const distance = distanceNum > 0 ? formatDistance(distanceNum) : '';

                  return (
                    <div key={r.id} onClick={() => navigate(`/member/reviews/${r.id}`)}>
                      <ReviewCard
                        key={r.id}
                        restaurantId={r.id}
                        name={r.name}
                        category={category}
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
          {currentItems.length <= 0 && (
            <div>
              <p className=" text-center text-babgray-500 py-10">검색 결과가 없습니다.</p>
            </div>
          )}
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
    </div>
  );
}

export default ReviewsPage;
