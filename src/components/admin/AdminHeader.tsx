import {
  RiAlarmWarningLine,
  RiFileListLine,
  RiGroupLine,
  RiHeart3Line,
  RiUserLine,
} from 'react-icons/ri';
import { NavLink, useNavigate } from 'react-router-dom';

const adminMenu = [
  { name: '사용자 계정 관리', path: '/admin', icon: <RiUserLine /> },
  { name: '파트너 계정 관리', path: '/admin/partners', icon: <RiGroupLine /> },
  { name: '매칭 & 모임 관리', path: '/admin/matching', icon: <RiHeart3Line /> },
  { name: '신고 내역', path: '/admin/reports', icon: <RiAlarmWarningLine /> },
  { name: '문의 내역', path: '/admin/settings', icon: <RiFileListLine /> },
] as const;

export default function AdminHeader() {
  const navigate = useNavigate();
  return (
    <div className="fixed left-0 top-0 w-[260px] min-h-full bg-black text-white border-r border-neutral-800">
      <div className="p-6 border-b border-white text-2xl font-bold justify-between flex">
        <span>관리자 패널</span>
      </div>

      <nav className="flex flex-col w-[260px] mt-6 space-y-4 pl-6">
        {adminMenu.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center w-[200px] gap-5 p-2 text-center font-medium rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-bab-500 text-white shadow-[0_0_10px_rgba(255,87,34,0.6)]'
                  : 'text-white hover:text-white hover:bg-babgray-800'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
