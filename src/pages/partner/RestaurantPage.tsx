import { useEffect, useState } from 'react';
import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { useRestaurant } from '../../contexts/PartnerRestaurantContext';
import { AwardLine, CalendarLine, StarFill, UserHeartLine } from '../../ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import type { Profile } from '../../types/bobType';
import { getProfile } from '../../lib/propile';
import DaysSince from '../../components/partner/DaysSince';
import { fetchInterests } from '../../lib/interests';
import { Divider } from 'antd';

function RestaurantPage() {
  const { restaurant } = useRestaurant();
  const [storename, setStorename] = useState('');
  const { user } = useAuth();
  // 로딩
  const [loading, setLoading] = useState<boolean>(true);
  // 사용자 프로필
  const [profileData, setProfileData] = useState<Profile | null>(null);
  // 에러메세지
  const [error, setError] = useState<string>('');
  // 사용자 닉네임
  const [nickName, setNickName] = useState<string>('');

  const loadProfile = async () => {
    if (!user?.id) {
      setError('사용자정보 없음');
      setLoading(false);
      return;
    }
    try {
      // 사용자 정보 가져오기
      const tempData = await getProfile(user?.id);
      if (!tempData) {
        // null의 경우
        setError('사용자 프로필 정보 찾을 수 없음');
        return;
      }
      // 사용자 정보 유효함
      setNickName(tempData.nickname || '');
      setProfileData(tempData);
    } catch (error) {
      setError('프로필 호출 오류');
    } finally {
      setLoading(false);
    }
  };

  // id로 닉네임을 받아옴
  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  useEffect(() => {
    if (profileData?.role === 'admin') {
      setStorename('관리자');
    }
    if (restaurant) {
      setStorename(restaurant?.name);
    }
  }, []);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const all = await fetchInterests();
      const foodCategories = all.filter(item => item.category === '음식 종류');
      setCategories(foodCategories);
    };
    loadCategories();
  }, []);

  const categoryName =
    categories.find(item => item.id === restaurant?.category_id)?.name || '알수없음';

  const formatTime = (timeString?: string | null): string => {
    if (!timeString) return '-';
    return timeString.slice(0, 5); // "09:00:00" → "09:00"
  };

  return (
    <>
      <PartnerBoardHeader
        title="매장 정보 관리"
        subtitle="레스토랑 기본 정보를 관리하고 업데이트하세요."
      />
      <div className="w-full h-full mx-auto flex flex-col gap-[35px] bg-gray-50">
        {/* 기본 정보 + 위치 */}
        <div className="grid grid-cols-2 gap-[35px]">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border p-8 flex flex-col justify-between gap-6">
            <h2 className="text-xl font-bold text-gray-800">기본 정보</h2>
            <div className="flex flex-col gap-8 text-base text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">매장명</span>
                <span>{storename}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">카테고리</span>
                <span>{categoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">전화번호</span>
                <span>{restaurant?.phone}</span>
              </div>
            </div>
          </div>

          {/* 위치 및 운영시간 */}
          <div className="bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800">위치 및 운영시간</h2>
            <div className="flex flex-col gap-4 text-base text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">주소</span>
                <span>{restaurant?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">오픈시간</span>
                <span>{formatTime(restaurant?.opentime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">마감 시간</span>
                <span>{formatTime(restaurant?.closetime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">휴무일</span>
                <span>
                  {restaurant?.closeday
                    ? restaurant?.closeday
                        ?.sort(
                          (a, b) =>
                            ['월', '화', '수', '목', '금', '토', '일'].indexOf(a) -
                            ['월', '화', '수', '목', '금', '토', '일'].indexOf(b),
                        )
                        .map(day => `${day}요일`)
                        .join(', ') || '-'
                    : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 매장 소개 */}
        <div className="bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">매장 소개</h2>
          <p className="text-base text-gray-700">{restaurant?.storeintro}</p>
        </div>

        {/* 매장 현황 */}
        <div className="bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">매장 현황</h2>
          <div className="grid grid-cols-4 gap-[35px]">
            <div className="flex flex-col items-center gap-2">
              <CalendarLine bgColor="#FFEDD5" color="#C2481F" size={20} padding={14} />
              <span className="text-base text-gray-500">BaB과 함께한 날</span>
              <span className="text-lg font-semibold text-gray-800">
                {' '}
                {restaurant?.created_at ? DaysSince(restaurant.created_at) : ''}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StarFill bgColor="#DBEAFE" color="#3B82F6" size={20} padding={14} />
              <span className="text-base text-gray-500">평균 별점</span>
              <span className="text-lg font-semibold text-gray-800">
                {restaurant?.send_avg_rating}/5.0
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <UserHeartLine bgColor="#DCFCE7" color="#22C55E" size={20} padding={14} />
              <span className="text-base text-gray-500">단골 고객</span>
              <span className="text-lg font-semibold text-gray-800">{restaurant?.favorite}명</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AwardLine bgColor="#F3E8FF" color="#A855F7" size={20} padding={14} />
              <span className="text-base text-gray-500">인증 현황</span>
              <span className="text-lg font-semibold text-gr  ay-800">프리미엄</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RestaurantPage;
