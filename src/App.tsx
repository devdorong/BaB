import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import BareLayout from './layout/BareLayout';
import MemberLayout from './layout/MemberLayout';
import PartnerLayout from './layout/PartnerLayout';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminPartnersPage from './pages/admin/AdminPartnersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import IndexPage from './pages/IndexPage';
import MemberPage from './pages/member/MemberPage';
import MemberProfile from './pages/member/MemberProfilePage';
import MemberLoginPage from './pages/MemberLoginPage';
import MemberSignupPage from './pages/MemberSignupPage';
import NotFound from './pages/NotFoundPage';
import DashboardPage from './pages/partner/DashboardPage';
import MenusPage from './pages/partner/MenusPage';
import OrdersPage from './pages/partner/OrdersPage';
import PartnerSettingsPage from './pages/partner/PartnerSettingsPage';
import RestaurantPage from './pages/partner/RestaurantPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerSignupPage from './pages/PartnerSignupPage';
import MemberReviewsPage from './pages/member/MemberReviewsPage';
import MemberEventPage from './pages/member/MemberEventPage';
import MemberSupportPage from './pages/member/MemberSupportPage';
import MemberCommunityPage from './pages/member/MemberCommunityPage';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          {/* 회원 레이아웃 */}
          <Route path="/member" element={<MemberLayout />}>
            <Route path="main" element={<MemberPage />} />
            <Route path="community" element={<MemberCommunityPage />} />
            <Route path="reviews" element={<MemberReviewsPage />} />
            <Route path="events" element={<MemberEventPage />} />
            <Route path="support" element={<MemberSupportPage />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>

          {/* 로그인/회원가입 - 헤더 없는 화면 */}
          <Route element={<BareLayout />}>
            <Route path="member/login" element={<MemberLoginPage />} />
            <Route path="member/signup" element={<MemberSignupPage />} />
            <Route path="partner/login" element={<PartnerLoginPage />} />
            <Route path="partner/sign" element={<PartnerSignupPage />} />
          </Route>

          {/* 파트너 레이아웃 */}
          <Route path="/partner" element={<PartnerLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="restaurant" element={<RestaurantPage />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="settings" element={<PartnerSettingsPage />} />
          </Route>

          {/* 관리자 레이아웃 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="members" element={<AdminMembersPage />} />
            <Route path="partners" element={<AdminPartnersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
