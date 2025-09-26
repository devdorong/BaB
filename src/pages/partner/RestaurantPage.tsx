import PartnerBoardHeader from '../../components/PartnerBoardHeader';
import { AwardLine, CalendarLine, PhoneLine, StarFill, UserHeartLine } from '../../ui/Icon';

function RestaurantPage() {
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
                <span>도로롱의 피자가게</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">카테고리</span>
                <span>양식</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">전화번호</span>
                <span>053-1234-5678</span>
              </div>
            </div>
          </div>

          {/* 위치 및 운영시간 */}
          <div className="bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800">위치 및 운영시간</h2>
            <div className="flex flex-col gap-4 text-base text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">주소</span>
                <span>대구광역시 동성로 12길 123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">오픈시간</span>
                <span>11:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">마감 시간</span>
                <span>22:00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">휴무일</span>
                <span>월요일</span>
              </div>
            </div>
          </div>
        </div>

        {/* 매장 소개 */}
        <div className="bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">매장 소개</h2>
          <p className="text-base text-gray-700">
            정통 이탈리안 요리와 따뜻한 분위기의 가족 레스토랑입니다.
          </p>
        </div>

        {/* 매장 현황 */}
        <div className="bg-white rounded-lg shadow-[0px_4px_4px_rgba(0,0,0,0.02)] border p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">매장 현황</h2>
          <div className="grid grid-cols-4 gap-[35px]">
            <div className="flex flex-col items-center gap-2">
              <CalendarLine bgColor="#FFEDD5" color="#C2481F" size={20} padding={14} />
              <span className="text-base text-gray-500">BaB과 함께한 날</span>
              <span className="text-lg font-semibold text-gray-800">3년 2개월</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <StarFill bgColor="#DBEAFE" color="#3B82F6" size={20} padding={14} />
              <span className="text-base text-gray-500">평균 별점</span>
              <span className="text-lg font-semibold text-gray-800">4.8/5.0</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <UserHeartLine bgColor="#DCFCE7" color="#22C55E" size={20} padding={14} />
              <span className="text-base text-gray-500">단골 고객</span>
              <span className="text-lg font-semibold text-gray-800">246명</span>
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
