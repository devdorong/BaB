import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { RiCalendarLine, RiMapPinLine, RiMoreFill, RiStoreLine } from 'react-icons/ri';
import { getRestaurantById, type RestaurantsDetailType } from '../../lib/restaurants';
import { supabase } from '../../lib/supabase';
import { getMatchingParticipants } from '../../services/matchingService';
import type { Matchings, Profile } from '../../types/bobType';
import TagBadge from '../../ui/TagBadge';
import { RecentMatchingRecordSkeleton } from '../../ui/dorong/RecentMatchingRecordSkeleton';
import { categoryColors } from '../../ui/jy/categoryColors';
import { useNavigate } from 'react-router-dom';

interface YetMatchingRecordItemProps {
  matching: Matchings;
}

const YetMatchingRecordItem = ({ matching }: YetMatchingRecordItemProps) => {
  const navigate = useNavigate();
  const [hostNickname, setHostNickname] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Partial<Profile> | null>(null);
  const [place, setPlace] = useState<RestaurantsDetailType | null>(null);
  const [interst, setInterst] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<
    { id: number; nickname: string; avatar_url: string }[]
  >([]);
  const isoString = matching.met_at;
  const formatted = dayjs(isoString).format('YYYY-MM-DD HH:mm');

  useEffect(() => {
    const fetchHostProfile = async (id: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('nickname,avatar_url')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('호스트 프로필 오류:', err);
        return null;
      }
    };

    const fetchInterest = async (id: number) => {
      try {
        const { data, error } = await supabase
          .from('interests')
          .select('name')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data?.name ?? null;
      } catch (err) {
        console.error('관심사 호출 오류:', err);
        return null;
      }
    };

    const fetchRestaurant = async () => {
      const data = await getRestaurantById(matching.restaurant_id);
      setPlace(data);
      return data;
    };

    const loadData = async () => {
      try {
        setLoading(true);
        const profileData = await fetchHostProfile(matching.host_profile_id);
        const restaurant = await fetchRestaurant();
        const peoples = await getMatchingParticipants(matching.id);

        // 참가자 닉네임들 병렬 조회
        const participantProfiles = await Promise.all(
          peoples.map(async (p: any) => {
            const { data, error } = await supabase
              .from('profiles')
              .select('nickname,avatar_url')
              .eq('id', p.profile_id)
              .single();

            if (error) {
              console.error('참가자 프로필 오류:', error.message);
              return {
                id: p.id,
                nickname: '알 수 없음',
                avatar_url: 'https://www.gravatar.com/avatar/?d=mp&s=200',
              };
            }
            return {
              id: p.id,
              nickname: data?.nickname ?? '알 수 없음',
              avatar_url: data.avatar_url,
            };
          }),
        );

        setParticipants(participantProfiles);

        let interData = null;
        if (restaurant?.category_id != null) {
          interData = await fetchInterest(restaurant.category_id);
          setInterst(interData);
        }

        setProfileData(profileData);
        setHostNickname(profileData?.nickname ?? null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (matching?.host_profile_id) loadData();
  }, [matching]);

  if (loading) {
    return <RecentMatchingRecordSkeleton />;
  }

  return (
    <section className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.05)]">
      <div className="flex gap-5 items-start">
        {/* 프로필 이미지 */}
        <div className="lg:flex hidden relative shrink-0">
          <img
            src={
              profileData?.avatar_url !== 'guest_image'
                ? profileData?.avatar_url
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

              {/* 상태 */}
              {matching.status === 'waiting' ? (
                <TagBadge bgColor="bg-blue-100" textColor="text-blue-700">
                  예정
                </TagBadge>
              ) : (
                <TagBadge bgColor="bg-green-100" textColor="text-green-700">
                  대기
                </TagBadge>
              )}
            </div>
            <RiMoreFill
              className="text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => navigate(`/member/matching/${matching.id}`)}
            />
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

            <div className="flex flex-wrap gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YetMatchingRecordItem;
