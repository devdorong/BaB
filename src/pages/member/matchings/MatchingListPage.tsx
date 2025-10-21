import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import MatchCard, { type Badge } from '../../../components/MatchCard';
import { fetchInterestsGrouped } from '../../../lib/interests';
import { getMatchings } from '../../../services/matchingService';
import { getRestaurantById } from '../../../services/restaurants';
import type { Matchings } from '../../../types/bobType';
import MatchCardSkeleton from '../../../ui/dorong/MatchCardSkeleton';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';
import { useModal } from '../../../ui/sdj/ModalState';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const FOOD_CATEGORY = '음식 종류';
const ITEMS_PER_PAGE = 6;

type ProcessedMatching = Matchings & {
  tags: Badge[];
  title: string;
  description: string;
  distanceKm: number;
  area: string;
  timeAgo: string;
  latitude?: number;
  longitude?: number;
  category: string;
  distanceNum?: number;
};

type SortOption = '최신순' | '거리순';

const MatchingListPage = () => {
  const { closeModal, modal, openModal } = useModal();

  // State
  const [processedMatchings, setProcessedMatchings] = useState<ProcessedMatching[]>([]);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState('');

  // 유틸리티 함수들
  const getColorByCategory = (interestName: string): { bg: string; text: string } => {
    return categoryColors[interestName] || defaultCategoryColor;
  };

  const formatTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return created.toLocaleDateString();
  };

  const getDistanceNum = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 지구 반경 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const distance = getDistanceNum(lat1, lon1, lat2, lon2);
    return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
  };

  // 사용자 위치 가져오기
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

  // 관심사 데이터 로드
  useEffect(() => {
    const loadInterests = async () => {
      try {
        const grouped = await fetchInterestsGrouped();
        setInterests(grouped);
      } catch (err) {
        console.error('관심사 로드 실패:', err);
      }
    };
    loadInterests();
  }, []);

  // 매칭 데이터 가져오기 및 처리
  useEffect(() => {
    const fetchAndProcessMatchings = async () => {
      try {
        setLoading(true);
        const matchings = await getMatchings();
        const processed: ProcessedMatching[] = [];

        for (const matching of matchings) {
          const restaurant = await getRestaurantById(matching.restaurant_id);

          if (restaurant) {
            const categoryName = restaurant.interests?.name || '기타';
            const categoryColor = getColorByCategory(categoryName);

            const tags: Badge[] = [
              {
                label: categoryName,
                bgClass: categoryColor.bg,
                textClass: categoryColor.text,
              },
            ];

            const distanceNum =
              userPos && restaurant.latitude && restaurant.longitude
                ? getDistanceNum(
                    userPos.lat,
                    userPos.lng,
                    restaurant.latitude,
                    restaurant.longitude,
                  )
                : Infinity;

            processed.push({
              ...matching,
              tags,
              category: categoryName,
              title: matching.title || restaurant.name,
              description: matching.description || restaurant.storeintro || '',
              distanceKm: 0,
              area: restaurant.address || '위치 정보 없음',
              timeAgo: matching.created_at ? formatTimeAgo(matching.created_at) : '',
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0,
              distanceNum,
            });
          }
        }

        setProcessedMatchings(processed);
      } catch (error) {
        console.error('매칭 데이터 처리 중 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessMatchings();
  }, [userPos]);

  // 필터링 및 정렬 로직
  const filteredMatchings =
    selectedCategory === '전체'
      ? processedMatchings
      : processedMatchings.filter(m => m.category === selectedCategory);

  const sortedMatchings =
    sortOption === '거리순'
      ? [...filteredMatchings].sort(
          (a, b) => (a.distanceNum ?? Infinity) - (b.distanceNum ?? Infinity),
        )
      : [...filteredMatchings].sort(
          (a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(),
        );

  // 페이지네이션
  const totalPages = Math.ceil(sortedMatchings.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatchings = sortedMatchings.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-bg-bg">
      <div className="w-[1280px] mx-auto flex flex-col gap-8 py-8">
        {/* 타이틀 */}
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-bold">매칭게시판</p>
          <p className="text-babgray-600">매칭에 참여해보세요</p>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="flex p-[24px] flex-col gap-[16px] rounded-[20px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.02)]">
          {/* 검색바 */}
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
                placeholder="맛집 이름이나 음식 종류로 검색하기"
              />
            </div>
            <div className="flex px-[30px] py-[20px] justify-center items-center bg-bab-500 rounded-[18px]">
              <RiSearchLine className="text-white" />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-[8px] justify-start">
            <button
              onClick={() => handleCategoryChange('전체')}
              className={`px-4 py-2 rounded-full text-[13px] ${
                selectedCategory === '전체'
                  ? 'bg-bab-500 text-white'
                  : 'bg-babgray-100 text-babgray-700'
              }`}
            >
              전체
            </button>

            {(interests[FOOD_CATEGORY] ?? []).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-[13px] ${
                  selectedCategory === cat
                    ? 'bg-bab-500 text-white'
                    : 'bg-babgray-100 text-babgray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 정렬 옵션 */}
          <div className="flex gap-[8px]">
            <button
              onClick={() => handleSortChange('최신순')}
              className={`flex items-center justify-center px-[20px] py-[10px] rounded-[24px] text-[13px] font-medium transition-colors ${
                sortOption === '최신순'
                  ? 'bg-[#292929] text-white hover:bg-[#444]'
                  : 'bg-[#EDEDED] text-[#292929] hover:bg-[#DADADA]'
              }`}
            >
              최신순
            </button>

            <button
              onClick={() => handleSortChange('거리순')}
              className={`flex items-center justify-center px-[20px] py-[10px] rounded-[24px] text-[13px] font-medium transition-colors ${
                sortOption === '거리순'
                  ? 'bg-[#292929] text-white hover:bg-[#444]'
                  : 'bg-[#EDEDED] text-[#292929] hover:bg-[#DADADA]'
              }`}
            >
              거리순
            </button>
          </div>
        </div>

        {/* 매칭 리스트 */}
        <div className="w-full py-[30px] ">
          <ul className="flex flex-col gap-x-[30px] gap-y-[24px] list-none p-0 m-0">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <MatchCardSkeleton key={i} />
                ))}
              </>
            ) : processedMatchings.length === 0 ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <MatchCardSkeleton key={i} />
                ))}
              </>
            ) : paginatedMatchings.length > 0 ? (
              paginatedMatchings.map((item, index) => {
                const distance =
                  userPos && item.latitude && item.longitude
                    ? getDistance(userPos.lat, userPos.lng, item.latitude, item.longitude)
                    : '';

                return (
                  <MatchCard
                    key={`${item.id}-${index}`}
                    distance={distance}
                    {...item}
                    modal={modal}
                    openModal={openModal}
                    closeModal={closeModal}
                  />
                );
              })
            ) : (
              <li className="min-h-[calc(100vh/2.8)] flex items-center justify-center">
                <p className="text-center text-babgray-500 py-10">
                  해당 카테고리의 매칭이 없습니다.
                </p>
              </li>
            )}
          </ul>
        </div>

        {/* 페이지네이션 */}
        {paginatedMatchings.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-2 bg-bg-bg rounded disabled:opacity-50 hover:bg-bab hover:text-white"
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
        )}
      </div>
    </div>
  );
};

export default MatchingListPage;
