import {
  RiDashboardLine,
  RiFileListLine,
  RiMoneyDollarCircleLine,
  RiMoreFill,
  RiNotification2Line,
  RiRestaurantFill,
  RiStarLine,
  RiStoreLine,
  RiUserSettingsLine,
} from 'react-icons/ri';
import { RestaurantFill, UserFill, UserLine } from '../ui/Icon';
import { Link } from 'react-router-dom';

const PartnerHeader = () => {
  return (
    <div>
      <div className="w-64 h-screen flex fixed flex-col justify-between border-r border-babgray bg-white text-babgray-700">
        <div className="flex flex-col">
          <div className="px-6 py-8 border-b border-babgray flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-bab rounded-md">
              <RestaurantFill bgColor="#ff5722" />
            </div>
            <div className="flex flex-col">
              <p className="text-black text-lg font-bold">레스토랑허브</p>
              <p className="text-babgray-500 text-xs">파트너 대시보드</p>
            </div>
          </div>
          {/* 각 영역 눌렀을때 해당하는 헤더블록 나오도록 */}
          <div className="flex flex-col p-4 gap-2">
            <Link to={'/partner'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-bab-100 border-r-2 cursor-pointer border-bab">
                <RiDashboardLine className="text-bab w-4 h-4" />
                <p className="text-bab">대시보드</p>
              </div>
            </Link>
            <Link to={'/partner/restaurant'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                <RiStoreLine className="text-babgray-700 w-4 h-4" />
                <p className="text-babgray-700 text-base">매장 정보 관리</p>
              </div>
            </Link>
            <Link to={'/partner/menus'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                <RiRestaurantFill className="text-babgray-700 w-4 h-4" />
                <p className="text-babgray-700 text-base">메뉴 관리</p>
              </div>
            </Link>
            <Link to={'/partner/orders'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                <RiFileListLine className="text-babgray-700 w-4 h-4" />
                <p className="text-babgray-700 text-base">주문내역</p>
              </div>
            </Link>
            <Link to={'/partner/sale'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                <RiMoneyDollarCircleLine className="text-babgray-700 w-4 h-4" />
                <p className="text-babgray-700 text-base">매출 & 정산</p>
              </div>
            </Link>
            <Link to={'/partner/review'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                <RiStarLine className="text-babgray-700 w-4 h-4" />
                <p className="text-babgray-700 text-base">고객 리뷰</p>
              </div>
            </Link>
            <Link to={'/partner/notification'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                <RiNotification2Line className="text-babgray-700 w-4 h-4" />
                <p className="text-babgray-700 text-base">알림</p>
              </div>
            </Link>
            <Link to={'/partner/settings'}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer">
                <RiUserSettingsLine className="text-babgray-700 w-4 h-4" />
                <p className="text-babgray-700 text-base">계정 & 보안</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="p-4 border-t border-babgray flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
              <UserLine size={20} bgColor="#e5e7eb" color="#1f2937" />
            </div>
            <div className="flex flex-col">
              {/* 파트너 매장 이름 */}
              <p className="text-black text-sm">도로롱의 피자가게</p>
              {/* 파트너 id */}
              <p className="text-gray-600 text-xs">ehfhfhd12</p>
            </div>
          </div>
          <RiMoreFill className="text-gray-600 w-4 h-4 cursor-pointer" />
        </div>
      </div>
      <div className="pl-[272px] flex w-full items-center justify-between p-5 border-b border-b-babgray">
        <div className="flex flex-col gap-2">
          {/* 헤더메뉴 클릭시 보여주는 이름 */}
          <p className="text-3xl font-bold">대시보드</p>
          {/* ()에 파트너의 이름 들어가도록 */}
          <p className="text-babgray-700">
            안녕하세요, (도로롱)님! 오늘 레스토랑 현황을 확인해보세요.
          </p>
        </div>
        <div className="flex justify-center items-center gap-6">
          {/* 해당 알림 페이지로 이동 */}{' '}
          <Link to={'/partner/notification'}>
            <div className="relative flex justify-center items-center cursor-pointer">
              <RiNotification2Line className="flex text-2xl" />
              <div className="absolute -right-2 -top-3 flex w-4 justify-center items-center rounded-full bg-bab text-white text-xs">
                3
              </div>
            </div>
          </Link>
          {/* 파트너 프로필사진 출력 */}
          <div className="cursor-pointer">
            <UserFill size={15} padding={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerHeader;
