import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
