import { useEffect, useState } from 'react';
import {
  RiCalendarLine,
  RiCloseFill,
  RiEditLine,
  RiErrorWarningLine,
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
  getMatchingParticipants,
  getMatchings,
  getParticipantCount,
} from '../../../services/matchingService';
import { getRestaurantById, getRestaurantReviewStats } from '../../../services/restaurants';
import type { Matchings, Profile, Restaurants } from '../../../types/bobType';
import TagBadge from '../../../ui/TagBadge';
import { ButtonFillLG, ButtonLineLg, ButtonLineMd } from '../../../ui/button';
import KkoMapDetail from '../../../ui/jy/Kakaomapdummy';
import { categoryColors, defaultCategoryColor } from '../../../ui/jy/categoryColors';
import { StarRating } from '../../../components/member/StarRating';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

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

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=200';

const MatchingDetailPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMapLoaded = useKakaoLoader();
  const { id } = useParams<{ id: string }>();
  const matchingId = parseInt(id || '0', 10);

  const [matchingData, setMatchingData] = useState<ProcessedMatching | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<Profile>();
  const [headCount, setHeadCount] = useState(0);
  const [restaurant, setRestaurant] = useState<Restaurants | null>(null);
  const [members, setMembers] = useState<
    {
      id: any;
      profile_id: any;
      joined_at: any;
      role: any;
    }[]
  >([]);
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
          setLoading(false);
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

        setMatchingData(processedMatching);
        setRestaurant(restaurantData);

        // 6단계: 호스트 프로필 가져오기
        const userProfile = await getProfile(currentMatching.host_profile_id);
        if (userProfile) {
          setUserData(userProfile);
        }
      } catch (error) {
        console.error('매칭 상세 데이터 로드 중 에러:', error);
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
                      <TagBadge
                        bgColor={matchingData.tags[0].bgClass}
                        textColor={matchingData.tags[0].textClass}
                      >
                        {matchingData.tags[0].label}
                      </TagBadge>
                    </div>
                    <div className="text-[14px] text-babgray-500">{matchingData.timeAgo}</div>
                  </div>

                  {/* 제목 */}
                  <div className="text-[32px] font-bold">{matchingData.title}</div>
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
                      >
                        모집종료
                      </ButtonFillLG>
                    </>
                  ) : (
                    <>
                      <ButtonFillLG
                        className="w-full"
                        style={{ fontWeight: 600, borderRadius: '12px' }}
                      >
                        참여 신청하기
                      </ButtonFillLG>
                    </>
                  )}

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

                  <ButtonLineLg
                    className="w-full"
                    style={{ fontWeight: 600, borderRadius: '12px' }}
                  >
                    <div className="inline-flex items-center justify-center gap-1.5 font-semibold rounded-[12px] leading-none">
                      삭제하기
                      <RiCloseFill className="w-4 h-4 shrink-0 relative top-[1px]" />
                    </div>
                  </ButtonLineLg>
                </section>
              </div>

              {/* 지도 프리뷰 */}
              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-start bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex w-full flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[10px] font-bold">지도</div>

                  <div className="h-[200px] rounded-2xl overflow-hidden">
                    {isMapLoaded ? (
                      <KkoMapDetail />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        지도를 불러오는 중입니다...
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-[15px] mb-5 mt-3">{restaurant.address}</p>

                  <ButtonLineMd style={{ fontWeight: 600 }}>길찾기</ButtonLineMd>
                </div>
              </div>

              {/* 비슷한 모집글 */}
              <div className="inline-flex w-[400px] p-[25px] flex-col justify-center items-start bg-white rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.02)]">
                <div className="flex w-full flex-col">
                  <div className="text-babgray-900 text-[20px] mb-[10px] font-bold">
                    비슷한 모집글
                  </div>

                  <ul className="space-y-3">
                    <li className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-[10px]">
                          <TagBadge bgColor="bg-[#F1F8E9]" textColor="text-[#33691E]">
                            양식
                          </TagBadge>
                          <TagBadge bgColor="bg-[#FCE4EC]" textColor="text-[#AD1457]">
                            실내
                          </TagBadge>
                        </div>
                      </div>
                      <p className="mt-2 text-[15px] font-semibold text-gray-900">
                        강남 오마카세 같이 가요
                      </p>
                      <p className="mt-1 text-sm text-gray-500">1.5km · 2시간 전</p>
                    </li>

                    <li className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-[10px]">
                          <TagBadge bgColor="bg-[#F1F8E9]" textColor="text-[#33691E]">
                            양식
                          </TagBadge>
                          <TagBadge bgColor="bg-[#FCE4EC]" textColor="text-[#AD1457]">
                            실내
                          </TagBadge>
                        </div>
                      </div>
                      <p className="mt-2 text-[15px] font-semibold text-gray-900">
                        이탈리안 레스토랑 모집
                      </p>
                      <p className="mt-1 text-sm text-gray-500">2.1km · 3시간 전</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingDetailPage;
