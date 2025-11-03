import { Outlet } from 'react-router-dom';
import MemberHeader from '../components/member/MemberHeader';
import MemberFooter from '../components/member/MemberFooter';
import { PaymentProvider } from '../components/payment/PaymentContext';

function MemberLayout() {
  return (
    <PaymentProvider>
      <div className="bg-bg-bg">
        <MemberHeader />
        <main className="lg:min-h-[calc(100vh/0.9-298px)] min-h-[calc(100vh/0.9)]">
          <Outlet />
        </main>
        <MemberFooter />
      </div>
    </PaymentProvider>
  );
}

export default MemberLayout;
