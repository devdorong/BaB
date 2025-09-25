import { Outlet } from 'react-router-dom';
import PartnerHeader from '../components/PartnerHeader';

function PartnerLayout() {
  return (
    <div>
      <PartnerHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PartnerLayout;
