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
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
            <div className="flex flex-col cursor-pointer" onClick={() => navigate('/partner')}>
              <p className="text-black text-lg font-bold">레스토랑허브</p>
              <p className="text-babgray-500 text-xs">파트너 대시보드</p>
            </div>
          </div>
          {/* 각 영역 눌렀을때 해당하는 헤더블록 나오도록 */}
          <div className="flex flex-col p-4 gap-2">
            <NavLink
              to="/partner"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiDashboardLine
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    대시보드
                  </p>
                </>
              )}
            </NavLink>
            <NavLink
              to="/partner/restaurant"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiStoreLine
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    매장 정보 관리
                  </p>
                </>
              )}
            </NavLink>

            <NavLink
              to="/partner/menus"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiRestaurantFill
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    메뉴 관리
                  </p>
                </>
              )}
            </NavLink>

            <NavLink
              to="/partner/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiFileListLine
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    주문내역
                  </p>
                </>
              )}
            </NavLink>

            <NavLink
              to="/partner/sale"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiMoneyDollarCircleLine
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    매출 & 정산
                  </p>
                </>
              )}
            </NavLink>

            <NavLink
              to="/partner/review"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiStarLine
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    고객 리뷰
                  </p>
                </>
              )}
            </NavLink>

            <NavLink
              to="/partner/notification"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiNotification2Line
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    알림
                  </p>
                </>
              )}
            </NavLink>

            <NavLink
              to="/partner/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-bab-100 border-r-2 border-bab text-bab'
                    : 'hover:bg-gray-100 text-babgray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <RiUserSettingsLine
                    className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-bab' : 'text-babgray-700'}`}
                  />
                  <p
                    className={`transition-colors duration-200 ${isActive ? 'text-bab font-medium' : 'text-babgray-700 text-base'}`}
                  >
                    계정 & 보안
                  </p>
                </>
              )}
            </NavLink>
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
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  메인페이지로
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
