import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';
import { PartnerRestaurantProvider } from '../contexts/PartnerRestaurantContext';
import { MenusProvider } from '../contexts/MenuContext';

function PartnerLayout() {
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
