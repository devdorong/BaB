import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';
import { PartnerRestaurantProvider } from '../contexts/PartnerRestaurantContext';

function PartnerLayout() {
  return (
    <PartnerRestaurantProvider>
      <div className="relative">
        <PartnerHeader />
        <main className="ml-[256px] px-[32px] bg-bg-bg py-[141px] min-h-screen">
          <Outlet />
        </main>
      </div>
    </PartnerRestaurantProvider>
  );
}

export default PartnerLayout;
