import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';
import { PartnerRestaurantProvider } from '../contexts/PartnerRestaurantContext';
import { MenusProvider } from '../contexts/MenuContext';

function PartnerLayout() {
  return (
    <PartnerRestaurantProvider>
      <MenusProvider>
        <div className="relative">
          <PartnerHeader />
          <main className="ml-[256px] px-[32px] bg-bg-bg py-[141px] min-h-screen">
            <Outlet />
          </main>
        </div>
      </MenusProvider>
    </PartnerRestaurantProvider>
  );
}

export default PartnerLayout;
