import { useAuth } from '@/contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';

function PartnerLayout() {
  const { initialized } = useAuth();
  if (!initialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        로그인 정보를 확인 중입니다...
      </div>
    );
  }
  return (
    <div className="relative">
      <PartnerHeader />
      <main className="ml-[256px] px-[32px] bg-bg-bg py-[141px] pb-[32px] min-h-[calc(100vh/0.9)]">
        <Outlet />
      </main>
    </div>
  );
}

export default PartnerLayout;
