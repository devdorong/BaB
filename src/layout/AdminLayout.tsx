import AdminHeader from '@/components/admin/AdminHeader';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh/0.9)]">
      <AdminHeader />
      <main className="flex-1 ml-[260px] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
