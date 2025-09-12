import { Outlet } from 'react-router-dom';

function ProfilePage() {
  return (
    <div>
      <h2>ProfilePage</h2>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default ProfilePage;
