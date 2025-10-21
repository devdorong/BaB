import { useEffect, useState } from 'react';
import { RiAddLine, RiSearchLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMatchings } from '../../services/matchingService';
import { getRestaurantById } from '../../services/restaurants';
import type { Matchings } from '../../types/bobType';
import { ButtonFillLG, ButtonLineMd } from '../../ui/button';
import MatchCardSkeleton from '../../ui/dorong/MatchCardSkeleton';
import { categoryColors, defaultCategoryColor } from '../../ui/jy/categoryColors';
import Modal from '../../ui/sdj/Modal';
import { useModal } from '../../ui/sdj/ModalState';
import MatchCard, { type Badge } from '../MatchCard';

type ProcessedMatching = Matchings & {
  tags: Badge[];
  title: string;
  description: string;
  distanceKm: number;
  area: string;
  timeAgo: string;
  latitude?: number;
  longitude?: number;
};

const MachingIndex = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { modal, closeModal, openModal } = useModal();
  const [matchingList, setMatchingList] = useState<Matchings[]>([]);
  const [processedMatchings, setProcessedMatchings] = useState<ProcessedMatching[]>([]);
  const [loading, setLoading] = useState(true);
  // 사용자 위치
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

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

  useEffect(() => {
    const fetchAndProcessMatchings = async () => {
      try {
        setLoading(true);

        // 1. 매칭 데이터 가져오기
        const matchings = await getMatchings();

        // 2. 각 매칭에 대해 레스토랑 정보 가져오고 태그 조립하기
        const processed: ProcessedMatching[] = [];

        for (const matching of matchings) {
          // 레스토랑 ID로 레스토랑 정보 가져오기
          const restaurant = await getRestaurantById(matching.restaurant_id);

          if (restaurant) {
            // 카테고리 색상 가져오기
            const categoryName = restaurant.interests?.name || '기타';
            const categoryColor = getColorByCategory(categoryName);

            // 태그 배열 생성 (카테고리 + 추가 태그)
            const tags: Badge[] = [
              {
                label: categoryName,
                bgClass: categoryColor.bg,
                textClass: categoryColor.text,
              },
              // 필요시 추가 태그 (예: 실내/실외 등) 추가 가능
            ];

            processed.push({
              ...matching,
              tags,
              title: matching.title || restaurant.name,
              description: matching.description || restaurant.storeintro || '',
              distanceKm: 0, // 추후 거리계산 해서 집어넣기
              area: restaurant.address || '위치 정보 없음',
              timeAgo: matching.created_at ? formatTimeAgo(matching.created_at) : '',
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0,
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
  }, []);

  const handleButtonClick = () => {
    if (!user) {
      openModal('로그인 확인', '로그인이 필요합니다.', '닫기', '로그인', () =>
        navigate('/member/login'),
      );
    } else {
      navigate('/member/matching/write');
    }
  };
  useEffect(() => {
    const fetchMatching = async () => {
      const matching = await getMatchings();
      // console.log(matching);
      setMatchingList(matching);
    };
    fetchMatching();
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
    <div className="">
      {/* 상단 */}
      <div className="flex justify-between mt-[120px]">
        {/* 왼쪽 */}
        <div>
          <span className="text-3xl font-bold">매칭 대기중</span>
        </div>
        {/* 오른쪽 */}
        <div className="flex items-center justify-between gap-[30px]">
          {/* 검색창 */}
          <div className="flex items-center w-[300px] h-[56px]  px-[15px] py-[20px] bg-white rounded-[28px] border border-babgray-300 gap-[10px]">
            <input
              type="text"
              className="flex-1 text-[13px] text-gray-700 focus:outline-none ml-1"
              placeholder="원하는 음식이나 지역을 검색해보세요"
            />{' '}
            <RiSearchLine className="text-babgray-300 w-5 h-5 mr-2" />
          </div>
          <ButtonFillLG onClick={handleButtonClick}>
            <i>
              <RiAddLine size={24} />
            </i>
            <span>매칭 등록하기</span>
          </ButtonFillLG>
        </div>
      </div>
      {/* 중단 */}
      <div className="w-full pt-[30px] pb-[50px]">
        <ul
          className=" w-full grid list-none p-0 m-0 
  [grid-template-columns:repeat(auto-fill,615px)]
  justify-between
  gap-x-[30px] gap-y-[24px]
    "
        >
          {/* 매칭 대기중인 게시글 최대 4개 출력하기 테이블연결후 수정 */}
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <MatchCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {processedMatchings.map((item, index) => {
                const distance =
                  userPos && item.latitude && item.longitude
                    ? getDistance(userPos.lat, userPos.lng, item.latitude, item.longitude)
                    : '';
                return (
                  <MatchCard
                    key={index}
                    distance={distance}
                    {...item}
                    modal={modal}
                    openModal={openModal}
                    closeModal={closeModal}
                  />
                );
              })}
            </>
          )}
        </ul>
      </div>
      {/* 하단 */}
      <div className="flex justify-center pb-[50px]">
        <ButtonLineMd
          onClick={() => navigate('/member/matching')}
          style={{ borderRadius: '20px', padding: '20px 30px' }}
        >
          더보기
        </ButtonLineMd>
      </div>
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

export default MachingIndex;
