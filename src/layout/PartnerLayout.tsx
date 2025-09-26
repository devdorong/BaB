import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';

function PartnerLayout() {
  return (
    <div className="relative">
      <PartnerHeader />
      <main className="ml-[256px] px-[32px] bg-bg-bg py-[141px]">
        <Outlet />
      </main>
    </div>
  );
}

export default PartnerLayout;
