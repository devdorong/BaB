import { useEffect, useState } from 'react';
import {
  RiAlarmWarningLine,
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
  checkUserAlreadyInActiveMatching,
  deleteMatching,
  getMatchingParticipants,
  getMatchings,
  getParticipantCount,
  getSimilarMatchingsWithRestaurant,
  removeMatchingParticipant,
  updateMatching,
  updateMatchingStatus,
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
import type { ChatListItem } from '@/types/chatType';
import { findOrCreateDirectChat } from '@/services/directChatService';
import { useDirectChat } from '@/contexts/DirectChatContext';

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
  const { setCurrentChat, loadMessages, loadChats } = useDirectChat();
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
  const [status, setStatus] = useState('');

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

        if (currentMatching.status === 'cancel') {
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

        setStatus(processedMatch.status);
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

        setRating(data);
      }
    };
    fetchData();
  }, [matchingData]);

  const handlecomplete = async () => {
    openModal(
      '매칭 마감',
      <div>
        매칭 모집을 마감하시겠습니까?
        <br />
        마감 이후에는, 참여자와 1대1 채팅으로 소통해주세요!
      </div>,
      '아니오',
      '마감하기',
      // 모집 마감 클릭시
      async () => {
        await updateMatchingStatus(matchingId, 'completed');

        // 매칭 참가자 정보 불러오기
        const { data: matchingUser, error: matchingUserError } = await supabase
          .from('matching_participants')
          .select('profile_id')
          .eq('matching_id', matchingId);

        if (matchingUserError || !matchingUser?.length) {
          return;
        }

        const notification = matchingUser.map(u => ({
          profile_id: user?.id,
          receiver_id: u.profile_id,
          title: '매칭연결이 되었습니다.',
          content: '',
          target: 'profiles',
          type: '매칭완료',
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notification);

        if (notificationError) {
          throw new Error(notificationError.message);
        }

        closeModal();
        openModal(
          '매칭 마감',
          <div>
            매칭 모집이 마감되었습니다.
            <br />
            n참여자와 1대1 채팅으로 소통해주세요!
          </div>,
          '',
          '확인',
          () => {
            setTimeout(() => {
              navigate('/member/profile/recentmatching?tab=recent');
            }, 100);
          },
        );
      },
    );
  };

  const handleDeleteMatching = async () => {
    openModal('매칭 취소', '매칭을 정말 취소하시겠습니까?', '취소', '취소하기', async () => {
      try {
        await deleteMatching(matchingId);
        closeModal();
        openModal(
          '취소 완료',
          '매칭이 성공적으로 취소되었습니다.',
          '닫기',
          '',
          () => {},
          () =>
            setTimeout(() => {
              navigate('/member/matching');
            }, 0),
        );
      } catch (error) {
        console.error('매칭 취소 중 오류:', error);
        openModal('오류 발생', '매칭을 취소하는 중 문제가 발생했습니다.', '닫기');
      }
    });
  };

  const handleParticipation = async () => {
    if (!user) return;

    const isAlready = await checkUserAlreadyInActiveMatching(user.id);

    if (isAlready) {
      closeModal();
      openModal('빠른매칭', '이미 참여중인 매칭이있습니다.\n확인해주세요.', '', '확인', () =>
        navigate('/member/profile/recentmatching'),
      );
      return;
    }

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

          await removeMatchingParticipant(matchingId, user.id);

          // UI 업데이트
          setMembersWithProfiles(prev => prev.filter(p => p.profile_id !== user.id));
          setHeadCount(prev => prev - 1);
          setIsParticipant(false);

          closeModal();
          openModal('매칭 참여', '참가된 매칭에서 나왔습니다.', '', '확인', () => {
            closeModal();
          });
        } catch (error) {
          openModal('오류 발생', '매칭 나가기에 실패하였습니다. 다시 시도해주세요.', '닫기');
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

  const handleChatClick = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('로그인 정보를 불러올 수 없음');

      const { data: matching, error: matchingError } = await supabase
        .from('matchings')
        .select('desired_members, status, host_profile_id')
        .eq('id', matchingId)
        .single();

      if (matchingError) {
        throw new Error(`매칭 조회 실패: ${matchingError.message}`);
      }
      if (matching.status !== 'waiting') {
        throw new Error('이미 진행 중이거나 종료된 매칭입니다');
      }
      const { success, data: chatRoom } = await findOrCreateDirectChat(matching.host_profile_id);
      if (!success || !chatRoom?.id) throw new Error('채팅방 생성 실패');
      const chatData: ChatListItem = {
        id: chatRoom.id,
        other_user: {
          id: matching.host_profile_id,
          nickname: userData?.nickname ?? '호스트',
          avatar_url: userData?.avatar_url ?? null,
          email: '',
        },
        last_message: undefined,
        unread_count: 0,
        is_new_chat: false,
      };
      setCurrentChat(chatData);
      await loadMessages(chatData.id);
      navigate(`/member/profile/chat`, { state: { chatId: chatRoom.id } });
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {}, [matchingData, matchingId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading || !matchingData || !restaurant) {
    return <div className="flex items-center justify-center min-h-screen">불러오는 중...</div>;
  }

  return (
    <div className="flex bg-bg-bg">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
        <div className="mt-5 mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* 왼쪽 콘텐츠 */}
            <div className="flex flex-col w-full lg:flex-[2] gap-6">
              {/* 매칭 상세 정보 */}
              <div className="w-full px-5 sm:px-8 py-6 sm:py-8 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] flex flex-col">
                <div className="flex flex-col gap-4">
                  {/* 태그 + 시간 */}
                  <div className="flex justify-between flex-wrap gap-2">
                    <div className="flex gap-2">
                      <InterestBadge
                        bgColor={matchingData.tags[0].bgClass}
                        textColor={matchingData.tags[0].textClass}
                      >
                        {matchingData.tags[0].label}
                      </InterestBadge>
                      {headCount === matchingData.desired_members && (
                        <InterestBadge>모집완료</InterestBadge>
                      )}
                      {status === 'completed' && <InterestBadge>종료된 매칭</InterestBadge>}
                      {status === 'cancel' && <InterestBadge>취소된 매칭</InterestBadge>}
                    </div>
                    <div className="text-sm text-babgray-500">{matchingData.timeAgo}</div>
                  </div>

                  {/* 제목 */}
                  <div className="text-[24px] sm:text-[32px] font-bold flex items-center gap-3">
                    {matchingData.title}
                  </div>
                </div>

                {/* 작성자 프로필 */}
                <div className="flex items-center gap-4 my-6">
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={
                        userData?.avatar_url === 'guest_image' || !userData?.avatar_url
                          ? DEFAULT_AVATAR
                          : userData.avatar_url
                      }
                      alt={userData?.nickname}
                    />
                  </div>
                  <div className="text-lg font-semibold text-babgray-800">{userData?.nickname}</div>
                </div>

                {/* 모임일시 + 인원 */}
                <div className="bg-bg-bg rounded-2xl p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    {/* 모임일시 */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-[50px] h-[50px] bg-[#DBEAFE] rounded-full">
                        <RiCalendarLine className="text-[#256AEC]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-babgray-500">모임 일시</p>
                        <p className="text-base font-semibold text-babgray-800">
                          {matchingData.met_at ? formatMeetingDate(matchingData.met_at) : ''}
                        </p>
                      </div>
                    </div>

                    {/* 모집인원 */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-[50px] h-[50px] bg-[#DCFCE7] rounded-full">
                        <RiGroupLine className="text-[#16A34A]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-babgray-500">모집 인원</p>
                        <p className="text-base font-semibold text-babgray-800">
                          {headCount}명 / {matchingData.desired_members}명
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 상세설명 */}
                <div className="py-8 px-2 text-babgray-600 leading-7 whitespace-pre-line break-words">
                  {matchingData.description}
                </div>
              </div>

              {/* 식당 정보 */}
              <div className="w-full px-5 sm:px-8 py-6 sm:py-8 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-babgray-900 mb-6">식당 정보</h3>
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* 이미지 */}
                  <img
                    className="rounded-2xl w-full sm:w-[160px] h-[160px] object-cover"
                    src={restaurant.thumbnail_url ?? ''}
                    alt={restaurant.name}
                  />
                  {/* 텍스트 */}
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-babgray-900">
                      {restaurant.name}
                    </h4>
                    <div className="mt-2 flex items-center gap-2">
                      <StarRating rating={rating?.averageRating ?? 0} />
                      <p className="text-sm text-gray-700">
                        {rating?.averageRating
                          ? `${rating.averageRating} (${rating.reviewCount ?? 0}개)`
                          : '아직 등록된 리뷰가 없습니다.'}
                      </p>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                      <RiMapPinLine className="text-[#FF5722]" /> {restaurant.address}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                      <RiPhoneLine className="text-babbutton-green" /> {restaurant.phone}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-700">
                      <RiTimeLine className="text-babbutton-blue" />
                      {formatTime(restaurant.opentime)} - {formatTime(restaurant.closetime)}
                    </p>
                  </div>
                </div>
                <ButtonLineLg
                  style={{ fontWeight: 600, marginTop: 24 }}
                  onClick={() => navigate(`/member/reviews/${restaurant.id}`)}
                >
                  식당 상세정보 보기
                </ButtonLineLg>
              </div>

              {/* 참여자 */}
              <div className="w-full px-5 sm:px-8 py-6 sm:py-8 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)] flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-babgray-900 mb-6">
                  참여자 ({headCount}/{matchingData.desired_members}명)
                </h3>
                <ul className="space-y-3">
                  {membersWithProfiles
                    .slice()
                    .sort((a, b) => (a.role === 'host' ? -1 : b.role === 'host' ? 1 : 0))
                    .map(p => (
                      <li key={p.id} className="flex items-center gap-3">
                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                          <img
                            src={
                              p.profile.avatar_url === 'guest_image' || !p.profile.avatar_url
                                ? DEFAULT_AVATAR
                                : p.profile.avatar_url
                            }
                            alt={p.profile.nickname}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <div className="text-sm sm:text-base font-semibold text-babgray-800">
                              {p.profile.nickname}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            {p.role === 'host' ? '모집자' : '참여자'}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
                <div className="mt-5 rounded-xl bg-gray-50 text-gray-600 text-sm text-center py-4">
                  {matchingData.desired_members && matchingData.desired_members - headCount > 0
                    ? `아직 ${matchingData.desired_members && matchingData.desired_members - headCount}
                  자리가 남아있어요!`
                    : '모집이 완료되었습니다.'}
                </div>
              </div>
            </div>

            {/* 오른쪽 패널 */}
            <div className="flex flex-col w-full lg:flex-[1] gap-6 lg:top-[100px]">
              {/* 액션 버튼 */}
              <div className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <section className="w-full space-y-3">
                  {/* 조건별 버튼 */}
                  {status !== 'waiting' && status !== 'full' ? (
                    <button
                      className="inline-flex w-full h-[50px] px-[15px] justify-center items-center rounded-lg 
             bg-gray-300 text-white text-[16px] font-medium 
             cursor-not-allowed opacity-70 
             hover:bg-gray-400 hover:opacity-70 transition-colors duration-200"
                      disabled
                    >
                      종료된매칭
                    </button>
                  ) : user?.id === userData?.id ? (
                    <ButtonFillLG className="w-full" onClick={handlecomplete}>
                      모집종료
                    </ButtonFillLG>
                  ) : isParticipant ? (
                    <ButtonFillLG className="w-full" onClick={handleLeave}>
                      참여 취소하기
                    </ButtonFillLG>
                  ) : (
                    <ButtonFillLG className="w-full" onClick={handleParticipation}>
                      참여 신청하기
                    </ButtonFillLG>
                  )}

                  {status !== 'waiting' && status !== 'full' ? (
                    <button className="hidden" disabled>
                      종료된매칭
                    </button>
                  ) : user?.id === userData?.id ? (
                    <ButtonLineLg
                      className="w-full"
                      onClick={() => navigate(`/member/matching/edit/${id}`)}
                    >
                      <div className="flex gap-1 items-center justify-center">
                        수정하기 <RiEditLine className="w-4 h-4" />
                      </div>
                    </ButtonLineLg>
                  ) : (
                    <ButtonLineLg
                      className="w-full"
                      // onClick={() => navigate(`/member/profile/chat`)}
                      onClick={() => handleChatClick()}
                    >
                      <div className="flex gap-1 items-center justify-center">
                        1:1 채팅 <RiChat3Line className="w-4 h-4" />
                      </div>
                    </ButtonLineLg>
                  )}

                  {status !== 'waiting' && status !== 'full' ? (
                    <button className=" hidden" disabled>
                      종료된매칭
                    </button>
                  ) : user?.id === userData?.id ? (
                    <ButtonLineLg className="w-full" onClick={handleDeleteMatching}>
                      <div className="flex gap-1 items-center justify-center">
                        취소하기 <RiCloseFill className="w-4 h-4" />
                      </div>
                    </ButtonLineLg>
                  ) : (
                    <ButtonLineLg
                      className="w-full"
                      onClick={() => {
                        setReportInfo({
                          type: '매칭',
                          nickname: userData?.nickname ?? null,
                          targetProfileId: userData?.id,
                        });
                        setReports(true);
                      }}
                    >
                      <div className="flex gap-1 items-center justify-center">
                        신고하기
                        <RiAlarmWarningLine />
                      </div>
                    </ButtonLineLg>
                  )}
                </section>
              </div>

              {/* 지도 프리뷰 */}
              <div className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <h3 className="text-lg font-semibold text-babgray-900 mb-3">지도</h3>
                <div className="h-[200px] rounded-2xl overflow-hidden">
                  {isMapLoaded ? (
                    <KkoMapMatching
                      lat={restaurant.latitude?.toString()}
                      lng={restaurant.longitude?.toString()}
                    />
                  ) : (
                    <div className="py-10 text-center text-babgray-600">
                      지도를 불러오는 중입니다...
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-3 mb-5">{restaurant.address}</p>
                <ButtonLineMd
                  className="w-full"
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

              {/* 비슷한 모집글 */}
              <div className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.02)]">
                <h3 className="text-lg sm:text-xl font-bold text-babgray-900 mb-3">
                  비슷한 모집글
                </h3>
                {similarMatchings.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">비슷한 모집글이 없습니다</div>
                ) : (
                  <ul className="space-y-3">
                    {similarMatchings.map(similar => {
                      const categoryName = similar.restaurants.interests?.name || '기타';
                      const categoryColor = getColorByCategory(categoryName);
                      let distance: number | null = null;
                      if (
                        restaurant.latitude &&
                        restaurant.longitude &&
                        similar.restaurants.latitude &&
                        similar.restaurants.longitude
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
                          <TagBadge bgColor={categoryColor.bg} textColor={categoryColor.text}>
                            {categoryName}
                          </TagBadge>
                          <p className="mt-2 text-sm font-semibold text-gray-900 line-clamp-1">
                            {similar.title || similar.restaurants.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
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

      {/* 모달 및 기타 */}
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
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={result => {
          setIsPaymentModalOpen(false);
        }}
        selectedPG={selectedPG}
        amount={totalAmount}
        orderItems={sampleOrderItems}
        orderName="도로롱의 피자 주문"
      />
    </div>
  );
};

export default MatchingDetailPage;
