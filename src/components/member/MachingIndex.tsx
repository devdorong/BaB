import { useEffect, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMatchingsWithRestaurant, type MatchingWithRestaurant } from '../../services/matchingService';
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
  const [processedMatchings, setProcessedMatchings] = useState<ProcessedMatching[]>([]);
  const [loading, setLoading] = useState(true);
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

        // 한 번의 쿼리로 매칭 + 레스토랑 + 관심사 데이터 모두 가져오기
        const matchingsWithRestaurant = await getMatchingsWithRestaurant();

        // 데이터 가공  
        const processed: ProcessedMatching[] = matchingsWithRestaurant
          .filter(matching => matching.restaurants) // 레스토랑 정보가 있는 것만
          .map(matching => {
            const restaurant = matching.restaurants!;
            const categoryName = restaurant.interests?.name || '기타';
            const categoryColor = getColorByCategory(categoryName);

            const tags: Badge[] = [
              {
                label: categoryName,
                bgClass: categoryColor.bg,
                textClass: categoryColor.text,
              },
            ];

            return {
              ...matching,
              tags,
              title: matching.title || restaurant.name,
              description: matching.description || restaurant.storeintro || '',
              distanceKm: 0,
              area: restaurant.address || '위치 정보 없음',
              timeAgo: matching.created_at ? formatTimeAgo(matching.created_at) : '',
              latitude: restaurant.latitude || 0,
              longitude: restaurant.longitude || 0,
            };
          });

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

  // 현재위치 가져오기
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

  // 거리 계산
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`;
  };

  return (
    <div className="w-full pt-10 sm:pt-0">
      {/* 상단 */}
      <div className="flex justify-between items-center sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div>
          <span className="text-2xl sm:text-3xl font-bold">매칭 대기중</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-[20px] lg:gap-[30px]">
          <ButtonFillLG onClick={handleButtonClick} className="w-full sm:w-auto justify-center">
            <i>
              <RiAddLine size={22} className="sm:size-[24px]" />
            </i>
            <span className="text-sm sm:text-base">매칭 등록하기</span>
          </ButtonFillLG>
        </div>
      </div>

      {/* 중단 */}
      <div className="w-full pt-[30px] pb-[50px]">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-[30px] gap-y-[24px] place-items-center justify-center">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <MatchCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              {processedMatchings
                ?.filter(item => item.status === 'waiting')
                .slice(0, 4)
                .map((item, index) => {
                  const distance =
                    userPos && item.latitude && item.longitude
                      ? getDistance(userPos.lat, userPos.lng, item.latitude, item.longitude)
                      : '';
                  return (
                    <MatchCard
                      key={item.id || index}
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
          className="!rounded-[24px] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
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