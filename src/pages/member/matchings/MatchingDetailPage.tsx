import { useEffect, useState } from 'react';
import {
  RiCalendarLine,
  RiChat3Line,
  RiCloseFill,
  RiEditLine,
  RiErrorWarningLine,
  RiFlagLine,
  RiGroupLine,
  RiMapPinLine,
  RiPhoneLine,
  RiStarHalfSFill,
  RiStarSFill,
  RiTimeLine,
} from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import type { Badge } from '../../../components/MatchCard';
import { useKakaoLoader } from '../../../hooks/useKakaoLoader';
import { getProfile } from '../../../lib/propile';
import {
  addMatchingParticipant,
  deleteMatching,
  getMatchingParticipants,
  getMatchings,
  getParticipantCount,
  getSimilarMatchingsWithRestaurant,
  removeMatchingParticipant,
  updateMatching,
} from '../../../services/matchingService';
import { getRestaurantById, getRestaurantReviewStats } from '../../../services/restaurants';
import type {
  Database,
  Matching_Participants,
  Matchings,
  MatchingsUpdate,
  Profile,
  Restaurants,
} from '../../../types/bobType';
import TagBadge from '../../../ui/TagBadge';
import { ButtonFillLG, ButtonLineLg, ButtonLineMd } from '../../../ui/button';
import KkoMapDetail from '../../../ui/jy/Kakaomapdummy';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';
import { StarRating } from '../../../components/member/StarRating';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import KkoMapMatching from '../../../ui/dorong/KaKaoMapMatching';
import { useModal } from '../../../ui/sdj/ModalState';
import Modal from '../../../ui/sdj/Modal';
// ===== 결제 시스템 관련 import =====
import type { PGProvider } from '../../../components/payment/paymentService'; // PG사 타입
import PaymentModal from '../../../components/payment/PaymentModal'; // 결제 모달 컴포넌트
import { BankCardLine } from '../../../ui/Icon';
import { InterestBadge } from '../../../ui/tag';
import ReportsModal from '../../../ui/sdj/ReportsModal';

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
interface MemberWithProfile {
  id: number;
  profile_id: string;
  joined_at: string | null;
  role: string;
  profile: Profile;
}
type ProcessedMatchingData = Matchings & {
  label: string;
  bgClass?: string;
  textClass?: string;
  title: string;
  description: string;
  distanceKm: number;
  area: string;
  timeAgo: string;
  latitude?: number;
  longitude?: number;
};

type SimilarMatchingWithRestaurant = Matchings & {
  restaurants: {
    id: number;
    name: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    category_id: number | null;
    interests: { name: string } | null;
  };
};
export type ReportsType = Database['public']['Tables']['reports']['Insert']['report_type'];

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=200';

const MatchingDetailPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMapLoaded = useKakaoLoader();
  const { id } = useParams<{ id: string }>();
  const matchingId = parseInt(id || '0', 10);

  useEffect(() => {
    if (!user) {
      navigate('/member/matching', { replace: true });
    }
  }, [user, navigate]);

  const [originMatch, setOriginMatch] = useState<Matchings | null>(null);
  const [matchingData, setMatchingData] = useState<ProcessedMatching | null>(null);
  const [similarMatchings, setSimilarMatchings] = useState<SimilarMatchingWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<Profile>();
  const [headCount, setHeadCount] = useState(0);

  const { closeModal, modal, openModal, x } = useModal();

  const [restaurant, setRestaurant] = useState<Restaurants | null>(null);
  const [members, setMembers] = useState<Omit<Matching_Participants, 'matching_id'>[]>([]);
  const [rating, setRating] = useState<
    | {
        restaurantId: number;
        averageRating: null;
        reviewCount: number;
        message: string;
      }
    | {
        restaurantId: number;
        averageRating: number;
        reviewCount: number;
        message?: undefined;
      }
  >();
  const [membersWithProfiles, setMembersWithProfiles] = useState<MemberWithProfile[]>([]);
  const [reports, setReports] = useState(false);
  const [reportInfo, setReportInfo] = useState<{
    type: ReportsType;
    nickname: string | null;
    targetProfileId?: string;
  }>({
    type: '매칭',
    nickname: null,
    targetProfileId: undefined,
  });
  const [isParticipant, setIsParticipant] = useState(false);
  /** 결제 모달 열림/닫힘 상태 */
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  /** 선택된 PG사 (기본값: 토스페이먼츠) */
  const [selectedPG, setSelectedPG] = useState<PGProvider>('toss');

  // ===== 샘플 주문 데이터 =====
  // TODO: 실제 운영 시에는 장바구니나 주문 페이지에서 동적으로 가져와야 함

  /** 샘플 주문 상품 목록 */
  const sampleOrderItems = [
    { id: '1', name: '마르게리타 피자', price: 25000, quantity: 1 },
    { id: '2', name: '콜라', price: 2000, quantity: 2 },
  ];

  /** 총 결제 금액 계산 (상품별 가격 × 수량의 합계) */
  const totalAmount = sampleOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return '';
    // 초 단위를 잘라내고 시:분까지만 반환
    return timeString.slice(0, 5);
  };

  const formatMeetingDate = (isoString: string): string => {
    const date = new Date(isoString);
    const local = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    const month = local.getMonth() + 1;
    const day = local.getDate();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][local.getDay()];

    let hours = local.getHours();
    const minutes = local.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    hours = hours % 12 || 12;

    return `${month}월 ${day < 10 ? `0${day}` : day}일 (${dayOfWeek}) ${period} ${hours}시${
      minutes > 0 ? ` ${minutes}분` : ''
    }`;
  };

  useEffect(() => {
    const fetchSimilarMatchings = async () => {
      if (matchingId && restaurant?.id) {
        try {
          const similar = await getSimilarMatchingsWithRestaurant(matchingId, restaurant.id, 2);
          setSimilarMatchings(similar);
          console.log('비슷한 매칭:', similar);
        } catch (error) {
          console.error('비슷한 매칭 로드 실패:', error);
        }
      }
    };

    fetchSimilarMatchings();
  }, [matchingId, restaurant?.id]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 메인 데이터 로드 - 매칭, 레스토랑, 유저 프로필을 한 번에 처리
  useEffect(() => {
    const fetchMatchingDetail = async () => {
      try {
        setLoading(true);
        const data = await getParticipantCount(matchingId);
        setHeadCount(data);

        // 1단계: 모든 매칭 데이터 가져오기
        const matchings = await getMatchings();

        // 2단계: 현재 매칭ID와 일치하는 데이터 찾기
        const currentMatching = matchings.find(m => m.id === matchingId);

        if (!currentMatching) {
          console.warn(`존재하지 않는 매칭 ID 접근: ${matchingId}`);
          navigate('/member/matching', { replace: true });
          return; // ← 바로 중단
        }

        if (currentMatching.status !== 'waiting') {
          console.warn(`취소된 매칭 접근: ${matchingId}`);
          navigate('/member/matching', { replace: true });
          return;
        }

        if (currentMatching.id !== matchingId) {
          console.warn(`잘못된 매칭 ID 접근: param=${matchingId}, data=${currentMatching.id}`);
          navigate('/member/matching', { replace: true });
          return;
        }
        // 3단계: 레스토랑 정보 가져오기
        const restaurantData = await getRestaurantById(currentMatching.restaurant_id);

        if (!restaurantData) {
          setLoading(false);
          return;
        }

        // 4단계: 카테고리 정보와 태그 생성
        const categoryName = restaurantData.interests?.name || '기타';
        const categoryColor = getColorByCategory(categoryName);

        const tags: Badge[] = [
          {
            label: categoryName,
            bgClass: categoryColor.bg,
            textClass: categoryColor.text,
          },
        ];

        // 5단계: 처리된 매칭 데이터 생성
        const processedMatching: ProcessedMatching = {
          ...currentMatching,
          tags,
          title: currentMatching.title || restaurantData.name,
          description: currentMatching.description || restaurantData.storeintro || '',
          distanceKm: 0,
          area: restaurantData.address || '위치 정보 없음',
          timeAgo: currentMatching.created_at ? formatTimeAgo(currentMatching.created_at) : '',
          latitude: restaurantData.latitude || 0,
          longitude: restaurantData.longitude || 0,
        };
        const processedMatch: Matchings = { ...currentMatching };

        setMatchingData(processedMatching);
        setRestaurant(restaurantData);
        setOriginMatch(processedMatch);

        // 6단계: 호스트 프로필 가져오기
        const userProfile = await getProfile(currentMatching.host_profile_id);
        if (userProfile) {
          setUserData(userProfile);
        }
      } catch (error) {
        console.error('매칭 상세 데이터 로드 중 에러:', error);
        navigate('/member/matching', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (matchingId > 0) {
      fetchMatchingDetail();
    }
  }, [matchingId]);

  useEffect(() => {
    const fetchMatchingMembers = async () => {
      try {
        const participants = await getMatchingParticipants(matchingId);
        setMembers(participants);

        const detailed = await Promise.all(
          participants.map(async p => {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', p.profile_id)
              .single();

            if (error) {
              console.error(`프로필(${p.profile_id}) 조회 에러:`, error.message);
              return { ...p, profile: null };
            }

            return { ...p, profile };
          }),
        );

        setMembersWithProfiles(detailed);
        const joined = detailed.some(p => p.profile_id === user?.id);
        setIsParticipant(joined);
        console.log('프로필 포함 참가자:', detailed);
        console.log('로그인한 정보', user);
      } catch (err) {
        console.error('참가자 상세정보 불러오기 실패:', err);
      }
    };

    if (matchingId > 0) {
      fetchMatchingMembers();
    }
  }, [matchingId]);

  useEffect(() => {
    const fetchData = async () => {
      if (matchingData?.restaurant_id) {
        const data = await getRestaurantReviewStats(matchingData?.restaurant_id);
        console.log(data);
        setRating(data);
      }
    };
    fetchData();
  }, [matchingData]);
  const handlecomplete = async () => {
    openModal(
      '매칭 결제',
      '선결제를 진행 하시겠습니까?',
      '아니오',

      <div className="flex items-center gap-2">
        <BankCardLine color="none" bgColor="none" size={16} />
        <p>결제하기</p>
      </div>,
      // 결제 진행시
      () => {
        (closeModal(), setIsPaymentModalOpen(true));
      },
      // 결제 미진행시
      async () => {
        const updated: MatchingsUpdate = {
          ...originMatch,
          status: 'completed',
        };
        await updateMatching(matchingId, updated);
      },
    );
  };

  const handleDeleteMatching = async () => {
    openModal('매칭 삭제', '매칭을 정말 삭제하시겠습니까?', '취소', '삭제하기', async () => {
      try {
        await deleteMatching(matchingId);
        closeModal();
        openModal(
          '삭제 완료',
          '매칭이 성공적으로 삭제되었습니다.',
          '닫기',
          '',
          () => {},
          () =>
            setTimeout(() => {
              navigate('/member/matching');
            }, 0),
        );
      } catch (error) {
        console.error('매칭 삭제 중 오류:', error);
        openModal('오류 발생', '매칭을 삭제하는 중 문제가 발생했습니다.', '닫기');
      }
    });
  };

  const handleParticipation = async () => {
    openModal(
      '매칭 참여',
      '매칭에 참여하시겠습니까?',
      ' 취소',
      '참가하기',
      // 참가 신청시
      async () => {
        try {
          await addMatchingParticipant(matchingId, user!.id);
          closeModal();
          openModal(
            '매칭 참여',
            '매칭에 참여했습니다. 자세한 설명은 호스트에게 1대1 문의해주세요.',
            '',
            '확인',
            () => navigate('/member/profile/recentmatching'),
          );
        } catch (error) {
          console.log('매칭 참가중 오류 발생: ', error);
          openModal('오류 발생', '매칭 참가에 실패하였습니다. 다시 시도해주세요.', '닫기');
        }
      },
      // 취소 버튼 누를시
      () => {},
    );
  };
  const handleLeave = async () => {
    openModal(
      '매칭 참여',
      '참가한 매칭에서 나가시겠습니까?',
      '취소',
      '나가기',
      // 나가기 클릭시
      async () => {
        try {
          if (!user) {
            return;
          }
          await removeMatchingParticipant(matchingId, user!.id);
          setMembersWithProfiles(prev => prev.filter(p => p.profile_id !== user.id));
          setHeadCount(prev => prev - 1);
          setIsParticipant(false);
          closeModal();
          openModal('매칭 참여', '참가된 매칭에서 나왔습니다.', '', '확인', () => {
            closeModal();
          });
        } catch (error) {
          console.log('매칭 참가중 오류 발생: ', error);
          openModal('오류 발생', '매칭 참가에 실패하였습니다. 다시 시도해주세요.', '닫기');
        }
      },
      // 취소 버튼 누를시
      () => {},
    );
  };

  const handleReport = async (
    type: ReportsType,
    title: string,
    reason: string,
    targetProfileId: string | undefined,
  ) => {
    if (!user) {
      openModal('로그인 확인', '로그인이 필요합니다.', '닫기');
      return;
    }

    if (!targetProfileId) {
      openModal('사용자 정보', '신고 대상 정보를 불러오는데 실패했습니다.', '닫기');
      return;
    }

    const { error } = await supabase.from('reports').insert([
      {
        reporter_id: user.id,
        accused_profile_id: targetProfileId,
        reason: `${title.trim()} - ${reason.trim()}`,
        report_type: type,
      },
    ]);

    if (error) {
      console.error('신고 실패:', error);
      openModal('오류', '신고 중 오류가 발생했습니다.', '닫기');
    } else {
      openModal('신고완료', '신고가 접수되었습니다.', '닫기');
    }
  };

  if (loading || !matchingData || !restaurant) {
    return <div className="flex items-center justify-center min-h-screen">불러오는 중...</div>;
  }

  return (
    <div className="flex bg-bg-bg">
      <div className="flex flex-col w-[1280px] m-auto">
        <div className="mt-[20px] mb-[60px]">
          <div className="flex gap-[40px] items-start">
            {/* 왼쪽 프로필카드 */}
            <div className="flex flex-col w-full gap-[25px]">
              {/* 매칭 상세 정보 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col gap-[15px]">
                  {/* 음식태그 및 작성 시간 */}
                  <div className="flex justify-between">
                    <div className="flex gap-[10px]">
                      <InterestBadge
                        bgColor={matchingData.tags[0].bgClass}
                        textColor={matchingData.tags[0].textClass}
                      >
                        {matchingData.tags[0].label}
                      </InterestBadge>
                    </div>
                    <div className="text-[14px] text-babgray-500">{matchingData.timeAgo}</div>
                  </div>

                  {/* 제목 */}
                  <div
                    className={`text-[32px] font-bold flex items-center  ${matchingData ? 'gap-5' : ''}`}
                  >
                    {matchingData.title}{' '}
                    {matchingData.status !== 'waiting' && <TagBadge>종료된 매칭</TagBadge>}
                  </div>
                </div>

                {/* 글 작성자 프로필 */}
                <div className="flex my-[20px] gap-[20px] items-center">
                  <div className="flex w-[60px] h-[60px] rounded-full overflow-hidden">
                    <img
                      src={
                        userData?.avatar_url === 'guest_image' || !userData?.avatar_url
                          ? DEFAULT_AVATAR
                          : userData.avatar_url
                      }
                      alt={userData?.nickname}
                    />
                  </div>
                  <div className="text-[20px] font-semibold text-babgray-800">
                    {userData?.nickname}
                  </div>
                </div>

                {/* 모임일시 및 인원 */}
                <div className="bg-bg-bg rounded-[16px]">
                  <div className="flex justify-between p-6">
                    {/* 모임 일시 */}
                    <div className="flex flex-1 items-center gap-[15px]">
                      <div className="flex items-center rounded-[32px] justify-center w-[50px] h-[50px] bg-[#DBEAFE]">
                        <RiCalendarLine className="text-[#256AEC]" />
                      </div>
                      <div>
                        <p className="text-[16px] font-medium text-babgray-500">모임 일시</p>
                        <p className="text-[16px] font-semibold text-babgray-800">
                          {matchingData.met_at ? formatMeetingDate(matchingData.met_at) : ''}
                        </p>
                      </div>
                    </div>

                    {/* 모집 인원 */}
                    <div className="flex flex-1 items-center gap-[15px]">
                      <div className="flex items-center rounded-[32px] justify-center w-[50px] h-[50px] bg-[#DCFCE7]">
                        <RiGroupLine className="text-[#16A34A]" />
                      </div>
                      <div>
                        <p className="text-[16px] font-medium text-babgray-500">모집 인원</p>
                        <p className="text-[16px] font-semibold text-babgray-800">
                          {headCount}명 / {matchingData.desired_members}명
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 상세설명 */}
                <div className="flex py-10 px-2">
                  <p className="text-babgray-600 leading-7">{matchingData.description}</p>
                </div>
              </div>

              {/* 식당 정보 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[25px] font-bold">식당 정보</div>

                  {/* 식당 프로필 */}
                  <div className="flex gap-[30px]">
                    {/* 식당 이미지 */}
                    <img
                      className="rounded-[20px] w-[140px] h-[140px] object-cover"
                      src={restaurant.thumbnail_url ? restaurant.thumbnail_url : ''}
                      alt={restaurant.name}
                    />

                    {/* 식당 텍스트 정보 */}
                    <div className="flex-1 items-center">
                      {/* 식당명 */}
                      <h3 className="text-[18px] md:text-[20px] font-semibold text-babgray-900 leading-tight">
                        {restaurant.name}
                      </h3>

                      {/* 평점 */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                          <StarRating rating={rating?.averageRating ?? 0} />
                        </div>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">
                            {rating?.averageRating
                              ? rating.averageRating
                              : '아직 등록된 리뷰가 없습니다.'}
                          </span>
                          <span className="text-gray-500 font-medium ">
                            {rating?.reviewCount ? `  (${rating.reviewCount}개)` : ''}
                          </span>
                        </p>
                      </div>

                      {/* 주소 */}
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-700 leading-6">
                        <RiMapPinLine className="mt-[2px] w-4 h-4 text-[#FF5722] flex-shrink-0" />
                        {restaurant.address}
                      </p>

                      {/* 전화번호 */}
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-700 leading-6">
                        <RiPhoneLine className="mt-[2px] w-4 h-4 text-babbutton-green flex-shrink-0" />
                        {restaurant.phone}
                      </p>

                      {/* 영업시간 */}
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-700 leading-6">
                        <RiTimeLine className="mt-[2px] w-4 h-4 text-babbutton-blue flex-shrink-0" />
                        {formatTime(restaurant.opentime)} - {formatTime(restaurant.closetime)}
                        <span className="text-gray-500 ml-1">{`(라스트 오더 ${formatTime(restaurant.closetime)})`}</span>
                      </p>
                    </div>
                  </div>

                  <ButtonLineLg
                    style={{ fontWeight: 600, marginTop: 30 }}
                    onClick={() => navigate(`/member/reviews/${restaurant.id}`)}
                  >
                    식당 상세정보 보기
                  </ButtonLineLg>
                </div>
              </div>

              {/* 인원 */}
              <div className="inline-flex w-full px-[35px] py-[25px] flex-col justify-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[25px] font-bold">
                    참여자 ({headCount}/{matchingData.desired_members}명)
                  </div>

                  {/* 참여자 리스트 */}
                  <div className="flex flex-col gap-[20px]">
                    <ul className="space-y-3">
                      {membersWithProfiles.map(p => (
                        <li key={p.id} className="flex items-center gap-3">
                          {/* 프로필 이미지 */}
                          <div className="flex w-[60px] h-[60px] rounded-full overflow-hidden">
                            <img
                              src={
                                p.profile.avatar_url === 'guest_image' || !p.profile.avatar_url
                                  ? DEFAULT_AVATAR
                                  : p.profile.avatar_url
                              }
                              alt={p.profile.nickname}
                            />
                          </div>

                          {/* 이름 및 역할 */}
                          <div>
                            <div className="flex items-center gap-1">
                              <div className={`text-[16px] font-semibold text-babgray-800`}>
                                {p.profile.name}
                              </div>
                              {/* 차단 추가시 사용하기 */}
                              {/* {p.role === 'member' && (
                                <RiErrorWarningLine className="w-4 h-4 text-babbutton-red flex-shrink-0" />
                              )} */}
                            </div>
                            <p className="text-gray-500 text-[13px] leading-6">
                              {p.role === 'host' ? '모집자' : '참여자'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 남은 자리 안내 */}
                <div className="mt-5 rounded-xl bg-gray-50 text-gray-600 text-sm text-center py-4">
                  {matchingData.desired_members && matchingData.desired_members - headCount > 0
                    ? `아직 ${matchingData.desired_members && matchingData.desired_members - headCount}
                  자리가 남아있어요!`
                    : '모집이 완료되었습니다.'}
                </div>
              </div>
            </div>

            {/* 오른쪽 프로필 카드 */}
            <div className="flex flex-col gap-[20px] items-center justify-center">
              {/* 액션 버튼 */}
              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-center bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <section className="w-full space-y-3">
                  {user?.id === userData?.id ? (
                    <>
                      <ButtonFillLG
                        className="w-full"
                        style={{ fontWeight: 600, borderRadius: '12px' }}
                        onClick={handlecomplete}
                      >
                        모집종료
                      </ButtonFillLG>
                    </>
                  ) : (
                    <>
                      {isParticipant ? (
                        <>
                          <ButtonFillLG
                            className="w-full"
                            style={{ fontWeight: 600, borderRadius: '12px' }}
                            onClick={handleLeave}
                          >
                            참여 취소하기
                          </ButtonFillLG>
                        </>
                      ) : (
                        <>
                          <ButtonFillLG
                            className="w-full"
                            style={{ fontWeight: 600, borderRadius: '12px' }}
                            onClick={handleParticipation}
                          >
                            참여 신청하기
                          </ButtonFillLG>
                        </>
                      )}
                    </>
                  )}

                  {user?.id === userData?.id ? (
                    <>
                      <ButtonLineLg
                        className="w-full"
                        style={{ fontWeight: 600, borderRadius: '12px' }}
                        onClick={() => navigate(`/member/matching/edit/${id}`)}
                      >
                        <div className="flex gap-[5px] justify-center items-center">
                          수정하기
                          <RiEditLine className="w-4 h-4 shrink-0 relative top-[1px]" />
                        </div>
                      </ButtonLineLg>
                    </>
                  ) : (
                    <>
                      <ButtonLineLg
                        className="w-full"
                        style={{ fontWeight: 600, borderRadius: '12px' }}
                        onClick={() => navigate(`/member/profile/chat`)}
                      >
                        <div className="flex gap-[5px] justify-center items-center">
                          1:1 채팅
                          <RiChat3Line className="w-4 h-4 shrink-0 relative top-[1px]" />
                        </div>
                      </ButtonLineLg>
                    </>
                  )}

                  {user?.id === userData?.id ? (
                    <>
                      <ButtonLineLg
                        className="w-full"
                        style={{ fontWeight: 600, borderRadius: '12px' }}
                        onClick={handleDeleteMatching}
                      >
                        <div className="inline-flex items-center justify-center gap-1.5 font-semibold rounded-[12px] leading-none">
                          삭제하기
                          <RiCloseFill className="w-4 h-4 shrink-0 relative top-[1px]" />
                        </div>
                      </ButtonLineLg>
                    </>
                  ) : (
                    <>
                      <ButtonLineLg
                        className="w-full"
                        style={{ fontWeight: 600, borderRadius: '12px' }}
                        onClick={() => {
                          setReportInfo({
                            type: '매칭',
                            nickname: userData?.nickname ?? null, // 매칭 작성자
                            targetProfileId: userData?.id, // 호스트 프로필 ID
                          });
                          setReports(true);
                        }}
                      >
                        <div className="inline-flex items-center justify-center gap-1.5 font-semibold rounded-[12px] leading-none ">
                          <RiFlagLine className="w-4 h-4 shrink-0 relative top-[1px]" />
                          신고하기
                        </div>
                      </ButtonLineLg>
                    </>
                  )}
                </section>
              </div>

              {/* 지도 프리뷰 */}
              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-start bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex w-full flex-col">
                  <div className="h-[200px] rounded-2xl overflow-hidden">
                    {/* 지도 */}
                    <div>
                      <h3 className="text-[18px] font-semibold text-babgray-900 mb-3">지도</h3>
                      {isMapLoaded ? (
                        <KkoMapMatching
                          lat={restaurant.latitude?.toString()}
                          lng={restaurant.longitude?.toString()}
                        />
                      ) : (
                        <div className="py-10 text-center text-babgray-600 max-w-[1280px] mx-auto">
                          지도를 불러오는 중입니다...
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-[15px] mb-5 mt-3">{restaurant.address}</p>

                  <ButtonLineMd
                    style={{ fontWeight: 600 }}
                    onClick={() =>
                      window.open(
                        `https://map.kakao.com/link/to/${restaurant.name},${restaurant.latitude},${restaurant.longitude}`,
                        '_blank',
                      )
                    }
                  >
                    길찾기
                  </ButtonLineMd>
                </div>
              </div>

              {/* 비슷한 모집글 */}

              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-start bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex w-full flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[10px] font-bold">
                    비슷한 모집글
                  </div>

                  {similarMatchings.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">비슷한 모집글이 없습니다</div>
                  ) : (
                    <ul className="space-y-3">
                      {similarMatchings.map(similar => {
                        const categoryName = similar.restaurants.interests?.name || '기타';
                        const categoryColor = getColorByCategory(categoryName);

                        // 거리 계산 - null 체크를 명확히
                        let distance: number | null = null;
                        if (
                          restaurant.latitude != null &&
                          restaurant.longitude != null &&
                          similar.restaurants.latitude != null &&
                          similar.restaurants.longitude != null
                        ) {
                          distance = calculateDistance(
                            restaurant.latitude,
                            restaurant.longitude,
                            similar.restaurants.latitude,
                            similar.restaurants.longitude,
                          );
                        }

                        return (
                          <li
                            key={similar.id}
                            className="rounded-2xl border border-gray-100 bg-white px-4 py-3 cursor-pointer hover:border-gray-300 transition-colors"
                            onClick={() => navigate(`/member/matching/${similar.id}`)}
                          >
                            <div className="flex items-center gap-2">
                              <TagBadge bgColor={categoryColor.bg} textColor={categoryColor.text}>
                                {categoryName}
                              </TagBadge>
                            </div>
                            <p className="mt-2 text-[15px] font-semibold text-gray-900 line-clamp-1">
                              {similar.title || similar.restaurants.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {distance !== null ? `${distance.toFixed(1)}km` : '거리 정보 없음'} ·{' '}
                              {formatTimeAgo(similar.created_at || '')}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {reports && (
        <ReportsModal
          setReports={setReports}
          targetNickname={reportInfo.nickname ?? ''}
          handleReport={(type, title, reason) =>
            handleReport(type, title, reason, reportInfo.targetProfileId)
          }
          reportType={reportInfo.type}
        />
      )}
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
          onX={x}
        />
      )}
      {/* ===== 결제 모달 컴포넌트 ===== */}
      <PaymentModal
        isOpen={isPaymentModalOpen} // 모달 열림/닫힘 상태
        onClose={() => setIsPaymentModalOpen(false)} // 모달 닫기 핸들러
        onSuccess={result => {
          // ===== 결제 완료 시 실행되는 핵심 콜백 함수 =====
          console.log('결제 성공:', result);

          // TODO: 실제 운영 시에는 여기에 추가 작업을 구현해야 합니다
          // - 주문 데이터베이스 저장
          // - 결제 내역 저장
          // - 사용자 알림 발송
          // - 재고 차감
          // - 주문 상태 업데이트
          // - 이메일/SMS 알림 발송
          // - 포인트 적립 처리

          setIsPaymentModalOpen(false); // 결제 완료 후 모달 닫기
        }}
        selectedPG={selectedPG} // 선택된 PG사
        amount={totalAmount} // 총 결제 금액
        orderItems={sampleOrderItems} // 주문 상품 목록
        orderName="도로롱의 피자 주문" // 주문명
      />
    </div>
  );
};

export default MatchingDetailPage;
