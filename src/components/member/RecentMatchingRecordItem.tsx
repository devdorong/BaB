import { useEffect, useState } from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiMapLine,
  RiMapPinLine,
  RiMoreFill,
  RiStarFill,
  RiStoreLine,
} from 'react-icons/ri';
import { getRestaurantById, type RestaurantsDetailType } from '../../lib/restaurants';
import { supabase } from '../../lib/supabase';
import type { Matchings, Profile } from '../../types/bobType';
import TagBadge from '../../ui/TagBadge';
import dayjs from 'dayjs';
import { categoryColors } from '../../ui/jy/categoryColors';
import { getMatchingParticipants } from '../../services/matchingService';
import { RecentMatchingRecordSkeleton } from '../../ui/dorong/RecentMatchingRecordSkeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { UserQuickProfileContent } from '@/ui/dorong/UserQuickProfile';
import { useNavigate } from 'react-router-dom';

interface RecentMatchingRecordItemProps {
  endMatching: Matchings;
}

const RecentMatchingRecordItem = ({ endMatching }: RecentMatchingRecordItemProps) => {
  // console.log('여긴 완료된 매칭', endMatching);
  const navigate = useNavigate();
  const [hostNickname, setHostNickname] = useState<string | null>(null);
  const [place, setPlace] = useState<RestaurantsDetailType | null>(null);
  const [interst, setInterst] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Partial<Profile> | null>(null);
  const [loading, setLoading] = useState(true);

  const [participants, setParticipants] = useState<
    { id: number; profile_id: string; nickname: string; avatar_url: string }[]
  >([]);

  const isoString = endMatching.met_at;
  const formatted = dayjs(isoString).format('YYYY-MM-DD HH:mm');

  useEffect(() => {
    // 1. 호스트 프로필 닉네임 가져오기
    const fetchHostProfile = async (id: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('nickname,avatar_url')
          .eq('id', id)
          .single();

        if (error) {
          console.error('호스트 닉네임 호출 오류:', error.message);
          return null;
        }

        return data ?? null;
      } catch (err) {
        console.error('호스트 닉네임 오류:', err);
        return null;
      }
    };

    // 2. 관심사 정보 가져오기
    const fetchInterest = async (id: number) => {
      try {
        const { data, error } = await supabase
          .from('interests')
          .select('name')
          .eq('id', id)
          .single();

        if (error) {
          console.error('관심사 정보 호출 오류 DB:', error.message);
          return null;
        }

        return data?.name ?? null;
      } catch (err) {
        console.error('관심사 호출 오류:', err);
        return null;
      }
    };

    // 3. 가게 정보 가져오기 (데이터 반환하도록 수정)
    const fetchRestaurant = async () => {
      const data = await getRestaurantById(endMatching.restaurant_id);
      setPlace(data); // state에도 저장
      return data; // 바로 사용할 수 있게 반환
    };

    // 4. 통합 로드 함수
    const loadData = async () => {
      try {
        setLoading(true);
        const profileData = await fetchHostProfile(endMatching.host_profile_id);
        const restaurant = await fetchRestaurant(); // 데이터 즉시 사용 가능
        const peoples = await getMatchingParticipants(endMatching.id);
        // console.log('참여자 정보들', peoples);

        // 참가자 닉네임들 병렬 조회
        const participantProfiles = await Promise.all(
          peoples.map(async (p: any) => {
            const { data, error } = await supabase
              .from('profiles')
              .select('id,nickname,avatar_url')
              .eq('id', p.profile_id)
              .single();

            if (error) {
              console.error('참가자 프로필 오류:', error.message);
              return {
                id: p.id,
                profile_id: '프로필 uuid',
                nickname: '알 수 없음',
                avatar_url: 'https://www.gravatar.com/avatar/?d=mp&s=200',
              };
            }
            return {
              id: p.id,
              profile_id: p.profile_id ?? '알 수 없음',
              nickname: data?.nickname ?? '알 수 없음',
              avatar_url: data.avatar_url,
            };
          }),
        );

        setParticipants(participantProfiles);

        let interData = null;
        if (restaurant?.category_id != null) {
          interData = await fetchInterest(restaurant.category_id);
          // console.log('관심사 이름:', interData);
          setInterst(interData);
        }

        // console.log('호스트 이름:', profileData?.nickname);
        setProfileData(profileData);
        setHostNickname(profileData?.nickname);
      } catch (err) {
        console.error('데이터 로드 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    // 5. 실행 조건
    if (endMatching?.host_profile_id) {
      loadData();
    }
  }, [endMatching]);

  if (loading) {
    return <RecentMatchingRecordSkeleton />;
  }

  return (
    <>
      <section
        className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.05)] cursor-pointer"
        onClick={() => navigate(`/member/matching/${endMatching.id}`)}
      >
        <div className="flex gap-5 items-start">
          {/* 호스트 프로필 */}
          <div className="hidden lg:flex relative shrink-0">
            <img
              src={
                profileData?.avatar_url
                  ? profileData.avatar_url === 'guest_image'
                    ? `https://www.gravatar.com/avatar/?d=mp&s=200`
                    : profileData.avatar_url
                  : 'https://www.gravatar.com/avatar/?d=mp&s=200'
              }
              alt="호스트"
              className="w-14 h-14 rounded-full object-cover border border-gray-200"
            />
          </div>

          {/* 오른쪽 내용 */}
          <div className="flex flex-col flex-1 gap-3">
            {/* 상단: 이름 + 상태 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <p className="text-gray-900 font-semibold text-lg">{hostNickname}</p>
                {endMatching.status === 'completed' ? (
                  <TagBadge bgColor="bg-green-100" textColor="text-green-700">
                    완료
                  </TagBadge>
                ) : (
                  <TagBadge bgColor="bg-red-100" textColor="text-red-700">
                    취소
                  </TagBadge>
                )}
              </div>
              {/* <RiMoreFill className="text-gray-400 cursor-pointer hover:text-gray-600" /> */}
            </div>

            {/* 장소 + 시간 */}
            <div className="flex flex-col text-sm text-gray-600 leading-relaxed">
              <div className="lg:flex items-center gap-2 hidden">
                <RiStoreLine className="text-gray-500" />
                <span className="font-medium text-gray-800">{place?.name}</span>
                <span className="text-gray-400">·</span>
                <span className="truncate">{place?.address}</span>
              </div>
              <div className="flex flex-col lg:hidden">
                <div className="flex items-center gap-2">
                  <RiStoreLine className="text-gray-500" />
                  <span className="text-gray-800 font-medium">{place?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RiMapPinLine />
                  <span>{place?.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RiCalendarLine className="text-gray-500" />
                <span>{formatted}</span>
              </div>
            </div>

            {/* 관심사 */}
            {interst && (
              <div className="mt-1">
                <TagBadge
                  bgColor={categoryColors[interst]?.bg ?? 'bg-gray-100'}
                  textColor={categoryColors[interst]?.text ?? 'text-gray-700'}
                >
                  {interst}
                </TagBadge>
              </div>
            )}

            {/* 참가자 정보 */}
            <div className="bg-gray-50 rounded-xl p-4 mt-2 flex flex-col gap-3">
              <p className="text-gray-700 font-medium">참가자 정보</p>

              {/* <div className="flex flex-wrap gap-4">
                {participants.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                  >
                    <img
                      src={
                        p.avatar_url !== 'guest_image'
                          ? p.avatar_url
                          : 'https://www.gravatar.com/avatar/?d=mp&s=100'
                      }
                      alt={p.nickname}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium text-sm">{p.nickname}</span>
                  </div>
                ))}
              </div> */}
              <div className="flex flex-wrap gap-4">
                {participants.map(p => (
                  <DropdownMenu key={p.id} modal={false}>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                        <img
                          src={
                            p.avatar_url !== 'guest_image'
                              ? p.avatar_url
                              : 'https://www.gravatar.com/avatar/?d=mp&s=100'
                          }
                          alt={p.nickname}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-gray-800 font-medium text-sm">{p.nickname}</span>
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side="right"
                      align="start"
                      sideOffset={10}
                      collisionPadding={10}
                      avoidCollisions
                      className="p-4 rounded-xl shadow-xl data-[side=bottom]:animate-slide-up-fade"
                    >
                      <UserQuickProfileContent profileId={p.profile_id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RecentMatchingRecordItem;
