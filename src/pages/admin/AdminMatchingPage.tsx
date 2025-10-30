import Chart from '@/components/admin/Chart';
import MonthChart from '@/components/admin/MonthChart';
import MonthCart from '@/components/admin/MonthChart';
import { useAuth } from '@/contexts/AuthContext';
import type { RestaurantsDetailType } from '@/lib/restaurants';
import { supabase } from '@/lib/supabase';
import {
  getMatchings,
  getMatchingsWithRestaurant,
  getMatchingsWithRestaurantsAndStatus,
  getParticipantCount,
  getUserMatchings,
  type MatchingWithRestaurant,
} from '@/services/matchingService';
import { getRestaurantById } from '@/services/restaurants';
import type { Matchings, Profile } from '@/types/bobType';
import { categoryColors } from '@/ui/jy/categoryColors';
import TagBadge from '@/ui/TagBadge';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  RiCalendarLine,
  RiGroupLine,
  RiMap2Line,
  RiMapLine,
  RiMapPin2Line,
  RiMapPinLine,
  RiStoreLine,
  RiUser2Line,
  RiUser3Line,
  RiUser4Line,
  RiUser5Line,
  RiUserLine,
} from 'react-icons/ri';

function AdminMatchingPage() {
  const { user } = useAuth();
  const [place, setPlace] = useState<RestaurantsDetailType | null>(null);
  const [interest, setInterest] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Partial<Profile> | null>(null);
  const [loading, setLoading] = useState(true);
  const [headCount, setHeadCount] = useState(0);
  const [matchings, setMatchings] = useState<MatchingWithRestaurant[]>([]);
  const [endMatchings, setEndMatchings] = useState<Matchings[]>([]);
  const [expectedMatchings, setExpectedMatchings] = useState<Matchings[]>([]);

  useEffect(() => {
    const loadRecentMatchings = async () => {
      try {
        const all = await getMatchingsWithRestaurant();
        setMatchings(all);

        // console.log(all);
      } catch (err) {
        console.error('매칭 불러오기 실패:', err);
      }
    };

    loadRecentMatchings();
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'cancel':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">취소</span>;
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">완료</span>
        );
      case 'waiting':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            진행중
          </span>
        );
      case 'full':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">예정</span>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-bg p-8">
      <h2 className="text-[23px] font-bold text-gray-800 mb-2">매칭 및 모임 관리</h2>
      <p className="text-[13px] text-gray-500 mb-6">사용자 매칭 현황과 모임을 관리합니다.</p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col flex-1 gap-6 bg-white p-[25px] rounded-[16px] shadow h-[350px]">
            <h3 className="font-bold">매칭 성공률</h3>
            <Chart />
          </div>
          <div className="flex flex-col flex-1 gap-6 bg-white p-[25px] rounded-[16px] shadow h-[350px]">
            <h3 className="font-bold">월별 매칭 현황</h3>
            <MonthChart />
          </div>
        </div>
        <div className="flex flex-col w-full gap-6 bg-white p-[25px] rounded-[16px] shadow h-[350px]">
          <h3 className="font-bold">진행중인 모임</h3>
          <div className="flex">
            {matchings.slice(0, 3).map(i => {
              const isoString = i.met_at;
              const formatted = dayjs(isoString).format('YYYY-MM-DD HH:mm');

              return (
                <div
                  key={i.id}
                  className="w-full p-4 bg-white rounded-2xl shadow-[0_4px_8px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_6px_12px_rgba(0,0,0,0.05)]"
                >
                  <div className="mb-4">{statusBadge(i.status)}</div>
                  <div className="flex gap-5 items-start">
                    {/* 호스트 프로필 */}
                    <div className="relative shrink-0">
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
                        <div className="flex items-center gap-3"></div>
                        {/* <RiMoreFill className="text-gray-400 cursor-pointer hover:text-gray-600" /> */}
                      </div>

                      {/* 장소 + 시간 */}
                      <div className="flex flex-col text-[13px] text-gray-600 leading-relaxed">
                        <div className="flex items-center gap-3">
                          <RiMapPinLine className="" />
                          <span className="font-medium ">{i.restaurants?.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <RiCalendarLine className="text-gray-600" />
                          <span className="font-medium text-gray-600">{formatted}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <RiGroupLine className="text-gray-600" />
                          <span className="font-medium text-gray-600">{}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMatchingPage;
