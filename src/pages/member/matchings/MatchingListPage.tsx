import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine } from 'react-icons/ri';
import MatchCard, { type Badge } from '../../../components/MatchCard';
import { fetchInterestsGrouped } from '../../../lib/interests';
import type { Matchings } from '../../../types/bobType';
import MatchCardSkeleton from '../../../ui/dorong/MatchCardSkeleton';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';
import { useModal } from '../../../ui/sdj/ModalState';
import Modal from '../../../ui/sdj/Modal';
import { supabase } from '@/lib/supabase';
import { BlackTag, GrayTag } from '@/ui/tag';
import SortCategory from '@/components/member/SortCategory';
import { SortMatchingCategory } from '@/components/member/SortMatchingOption';
import AllCategory from '@/components/member/AllCategory';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ButtonFillMd, ButtonFillSm } from '@/ui/button';
import { checkUserAlreadyInActiveMatching } from '@/services/matchingService';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const FOOD_CATEGORY = '음식 종류';
const ITEMS_PER_PAGE = 6;

type RestaurantWithInterest = {
  id: string;
  name: string;
  thumbnail_url: string;
  address: string;
  storeintro: string;
  latitude: number;
  longitude: number;
  interests: {
    name: string;
  } | null;
} | null;

type ProfileData = {
  id: string;
  nickname: string;
} | null;

type MatchingWithJoin = Matchings & {
  restaurants: RestaurantWithInterest;
  profiles: ProfileData;
};

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const { closeModal, modal, openModal } = useModal();

  // State
  const [processedMatchings, setProcessedMatchings] = useState<ProcessedMatching[]>([]);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<Record<string, string[]>>({});
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | string>('전체');
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState('');
  const [lastSearchQuery, setLastSearchQuery] = useState('');

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
    const R = 6371;
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

  // 매칭 데이터 가져오기 (조인 쿼리로 최적화)
  const fetchMatchings = async (searchQuery: string) => {
    try {
      setLoading(true);
      setLastSearchQuery(searchQuery);

      let matchingQuery = supabase
        .from('matchings')
        .select(
          `
        *,
        restaurants!inner (
          id,
          name,
          thumbnail_url,
          address,
          storeintro,
          latitude,
          longitude,
          interests (
            name
          )
        ),
        profiles (
          id,
          nickname
        )
      `,
        )
        .eq('status', 'waiting')
        .order('created_at', { ascending: false });

      if (searchQuery.trim() !== '') {
        matchingQuery = matchingQuery.or(
          `title.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`,
        );
      }

      const { data, error } = await matchingQuery;

      if (error) throw error;

      // 3. 안전한 데이터 처리
      const processed: ProcessedMatching[] = (data || []).map((matching: MatchingWithJoin) => {
        const restaurant = matching.restaurants;

        // null 체크 강화
        const categoryName = restaurant?.interests?.name ?? '기타';
        const categoryColor = getColorByCategory(categoryName);

        const tags: Badge[] = [
          {
            label: categoryName,
            bgClass: categoryColor.bg,
            textClass: categoryColor.text,
          },
        ];

        const distanceNum =
          userPos && restaurant?.latitude && restaurant?.longitude
            ? getDistanceNum(userPos.lat, userPos.lng, restaurant.latitude, restaurant.longitude)
            : Infinity;

        return {
          ...matching,
          tags,
          category: categoryName,
          title: matching.title || restaurant?.name || '제목 없음',
          description: matching.description || restaurant?.storeintro || '설명 없음',
          distanceKm: 0,
          area: restaurant?.address || '위치 정보 없음',
          timeAgo: matching.created_at ? formatTimeAgo(matching.created_at) : '',
          latitude: restaurant?.latitude ?? 0,
          longitude: restaurant?.longitude ?? 0,
          distanceNum,
        };
      });

      setProcessedMatchings(processed);
      setCurrentPage(1);
    } catch (err) {
      console.error('매칭 데이터 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
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
        // console.error('위치 정보를 가져올 수 없습니다:', err);
        setUserPos({ lng: 128.59396682562848, lat: 35.86823232723134 });
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

  // 초기 매칭 데이터 로드 (userPos가 설정된 후)
  useEffect(() => {
    let isMounted = true;

    if (userPos && isMounted) {
      fetchMatchings('');
    }

    return () => {
      isMounted = false;
    };
  }, [userPos]); // userPos가 변경될 때만 실행

  const waitingMatchings = processedMatchings.filter(item => item.status === 'waiting');

  // 필터링 및 정렬 로직
  const filteredMatchings =
    selectedCategory === '전체'
      ? waitingMatchings
      : waitingMatchings.filter(m => m.category === selectedCategory);

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

  const handleWriteClick = async () => {
    if (!user) {
      openModal('로그인 확인', '로그인이 필요합니다.', '닫기', '로그인', () =>
        navigate('/member/login'),
      );
      return;
    }

    const isAlready = await checkUserAlreadyInActiveMatching(user.id);

    if (isAlready) {
      closeModal();
      openModal('빠른매칭', '이미 참여중인 매칭이있습니다.\n확인해주세요.', '', '확인', () =>
        navigate('/member/profile/recentmatching'),
      );
      return;
    }

    navigate(`/member/matching/write`);
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-bg-bg">
      <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-4 py-4 lg:gap-8 lg:py-8 px-4 sm:px-6 lg:px-8 xl:px-0">
        {/* 타이틀 */}
        <div className="flex flex-col gap-1 text-left">
          <p className="text-[24px] lg:text-3xl font-bold">매칭게시판</p>
          <p className="text-babgray-600 text-[16px]">매칭에 참여해보세요</p>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="flex flex-col gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
          {/* 검색바 */}
          <div className="flex w-full gap-3 sm:gap-4 items-center">
            <div
              onClick={() => document.getElementById('searchInput')?.focus()}
              className="flex w-full items-center bg-white border border-babgray rounded-3xl h-[50px] sm:h-[55px] px-4"
            >
              <input
                id="searchInput"
                className="focus:outline-none w-full text-sm sm:text-base"
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    fetchMatchings(search);
                  }
                }}
                placeholder="맛집 이름이나 음식 종류로 검색하기"
              />
            </div>
            <button
              onClick={() => fetchMatchings(search)}
              className="flex px-5 py-4 justify-center items-center bg-bab-500 rounded-[18px] cursor-pointer transition hover:bg-bab-600"
            >
              <RiSearchLine size={20} className="text-white" />
            </button>
          </div>

          {/* 카테고리 필터 */}
          <div className="hidden lg:flex flex-wrap gap-2 justify-start sm:justify-start">
            <button
              onClick={() => handleCategoryChange('전체')}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === '전체'
                  ? 'bg-bab-500 text-white'
                  : 'bg-babgray-100 text-babgray-700 hover:bg-babgray-200'
              }`}
            >
              전체
            </button>

            {(interests[FOOD_CATEGORY] ?? []).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
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

          {/* 정렬 옵션 */}
          {/* <div className="flex flex-wrap justify-start sm:justify-start gap-2">
            <button onClick={() => handleSortChange('최신순')} className="cursor-pointer">
              {sortOption === '최신순' ? <BlackTag>최신순</BlackTag> : <GrayTag>최신순</GrayTag>}
            </button>

            <button onClick={() => handleSortChange('거리순')} className="cursor-pointer">
              {sortOption === '거리순' ? <BlackTag>거리순</BlackTag> : <GrayTag>거리순</GrayTag>}
            </button>
          </div> */}
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
            <div className="flex justify-between items-center w-full flex-wrap">
              <div className="flex justify-start gap-[8px]">
                <SortMatchingCategory sortOption={sortOption} setSortOption={setSortOption} />
              </div>
              <ButtonFillMd onClick={handleWriteClick} className="flex justify-end">
                등록하기
              </ButtonFillMd>
            </div>
          </div>
        </div>

        {/* 매칭 리스트 */}
        <div className="w-full py-6 ">
          <ul className="flex flex-col gap-y-6 sm:gap-y-8 list-none p-0 m-0">
            {loading ? (
              [...Array(4)].map((_, i) => <MatchCardSkeleton key={i} />)
            ) : filteredMatchings.length === 0 ? (
              <li className="min-h-[calc(100vh/5)] flex items-center justify-center bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <p className="text-center text-babgray-500 py-10">
                  해당 카테고리의 매칭이 없습니다.
                </p>
              </li>
            ) : (
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
            )}
          </ul>
        </div>

        {/* 페이지네이션 */}
        {paginatedMatchings.length > 0 && (
          <div className="flex justify-center gap-2 mt-4 sm:mt-6 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-2 bg-bg-bg rounded hover:bg-bab hover:text-white disabled:opacity-50 transition"
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
              className="p-2 bg-white rounded hover:bg-bab hover:text-white disabled:opacity-50 transition"
            >
              <RiArrowRightSLine size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 모달 */}
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
        />
      )}
    </div>
  );
};

export default MatchingListPage;
