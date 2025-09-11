import { Outlet } from 'react-router-dom';

function BareLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default BareLayout;
