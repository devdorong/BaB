import { useEffect, useRef, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { RestaurantFill, UserLine } from '../ui/Icon';
import { useAuth } from '../contexts/AuthContext';

const PartnerHeader = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      alert('로그아웃 되었습니다.');
      signOut();
      navigate('/');
    }
    setOpen(false);
  };

  return (
    <div>
      <div className="w-64 h-screen z-50 flex fixed flex-col justify-between border-r border-babgray bg-white text-babgray-700">
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
        <div className="p-4 border-t border-babgray flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex items-center justify-center bg-gray-200 rounded-full">
              <UserLine size={20} bgColor="#e5e7eb" color="#1f2937" />
              <Link to={'/partner/notification'}>
                <div className="absolute -right-1.5 -top-1.5 flex w-4 justify-center items-center rounded-full bg-bab text-white text-xs">
                  3
                </div>
              </Link>
            </div>
            <div className="flex flex-col">
              {/* 파트너 매장 이름 */}
              <p className="text-black text-sm">도로롱의 피자가게</p>
              {/* 파트너 id */}
              <p className="text-gray-600 text-xs">ehfhfhd12</p>
            </div>
          </div>
          <div className="relative">
            <RiMoreFill
              className="text-gray-600 w-4 h-4 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div
                ref={menuRef}
                className="absolute left-4 bottom-4 bg-white border border-gray-200 rounded-md shadow-md py-2 w-32 z-50"
              >
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerHeader;
