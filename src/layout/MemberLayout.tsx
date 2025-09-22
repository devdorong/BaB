import { Outlet } from 'react-router-dom';
import MemberHeader from '../components/member/MemberHeader';
import MemberFooter from '../components/member/MemberFooter';

function MemberLayout() {
  return (
    <div className="bg-bg-bg">
      <MemberHeader />
      <main className="">
        <Outlet />
      </main>
      <MemberFooter />
    </div>
  );
}

export default MemberLayout;
