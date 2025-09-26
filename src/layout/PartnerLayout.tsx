import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';

function PartnerLayout() {
  return (
    <div>
      <PartnerHeader />
      <main className="flex ml-[256px] px-[32px] py-[32px] bg-bg-bg">
        <Outlet />
      </main>
    </div>
  );
}

export default PartnerLayout;
