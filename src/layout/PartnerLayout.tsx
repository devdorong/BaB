import { Outlet } from 'react-router-dom';

function PartnerLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PartnerLayout;
