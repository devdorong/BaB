import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import BareLayout from './layout/BareLayout';
import MemberLayout from './layout/MemberLayout';
import PartnerLayout from './layout/PartnerLayout';
import AdminMatchingPage from './pages/admin/AdminMatchingPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminPartnersPage from './pages/admin/AdminPartnersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import IndexPage from './pages/IndexPage';
import CommunityDetailPage from './pages/member/communitys/CommunityDetailPage';
import CommunityPage from './pages/member/communitys/CommunityPage';
import CommunityWritePage from './pages/member/communitys/CommunityWritePage';
import EventPage from './pages/member/EventPage';
import MemberPage from './pages/member/MemberPage';
import PostDetailPage from './pages/member/posts/PostDetailPage';
import PostsListPage from './pages/member/posts/PostsListPage';
import PostsWritePage from './pages/member/posts/PostsWritePage';
import BlockPage from './pages/member/profiles/BlockPage';
import ChatPage from './pages/member/profiles/ChatPage';
import EditPage from './pages/member/profiles/EditPage';
import FavoritePage from './pages/member/profiles/FavoritePage';
import InterestPage from './pages/member/profiles/InterestPage';
import PointPage from './pages/member/profiles/PointPage';
import ProfilePage from './pages/member/profiles/ProfilePage';
import RecentMatchingPage from './pages/member/profiles/RecentMatchingPage';
import ReviewDetailPage from './pages/member/reviews/ReviewDetailPage';
import ReviewsPage from './pages/member/reviews/ReviewsPage';
import SupportPage from './pages/member/SupportPage';
import MemberLoginPage from './pages/MemberLoginPage';
import MemberSignupPage from './pages/MemberSignupPage';
import NotFound from './pages/NotFoundPage';
import DashboardPage from './pages/partner/DashboardPage';
import MenusPage from './pages/partner/MenusPage';
import NotificationPage from './pages/partner/NotificationPage';
import OrdersPage from './pages/partner/OrdersPage';
import RestaurantPage from './pages/partner/RestaurantPage';
import ReviewPage from './pages/partner/ReviewPage';
import SalesPage from './pages/partner/SalesPage';
import SettingsPage from './pages/partner/SettingsPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerSignupPage from './pages/PartnerSignupPage';
import TermsofServicePage from './pages/TermsofServicePage';
import PersonalPolicyPage from './pages/PersonalPolicyPage';
import InsratgramPage from './pages/InsratgramPage';
import KaKaoPage from './pages/KaKaoPage';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          {/* Member */}
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<MemberPage />} />
            <Route path="posts">
              <Route index element={<PostsListPage />} />
              <Route path="write" element={<PostsWritePage />} />
              <Route path="detail" element={<PostDetailPage />} />
            </Route>
            <Route path="community">
              <Route index element={<CommunityPage />} />
              <Route path="write" element={<CommunityWritePage />} />
              <Route path="detail" element={<CommunityDetailPage />} />
            </Route>
            <Route path="reviews">
              <Route index element={<ReviewsPage />} />
              <Route path="detail" element={<ReviewDetailPage />} />
            </Route>
            <Route path="events" element={<EventPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="profile">
              <Route index element={<ProfilePage />} />
              <Route path="edit" element={<EditPage />} />
              <Route path="interest" element={<InterestPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="point" element={<PointPage />} />
              <Route path="favorite" element={<FavoritePage />} />
              <Route path="recentmatching" element={<RecentMatchingPage />} />
              <Route path="block" element={<BlockPage />} />
            </Route>
          </Route>

          {/* 이용약관/개인정보처리방침 */}
          <Route path="/privacy" element={<TermsofServicePage />} />
          <Route path="/perpolicy" element={<PersonalPolicyPage />} />

          {/* 소셜 */}
          <Route path="/instar" element={<InsratgramPage />} />
          <Route path="/kakao" element={<KaKaoPage />} />

          {/* 헤더없는 화면 */}
          <Route element={<BareLayout />}>
            <Route path="member/login" element={<MemberLoginPage />} />
            <Route path="member/signup" element={<MemberSignupPage />} />
            <Route path="partner/login" element={<PartnerLoginPage />} />
            <Route path="partner/signup" element={<PartnerSignupPage />} />
          </Route>

          {/* Partner */}
          <Route path="/partner" element={<PartnerLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="restaurant" element={<RestaurantPage />} />
            <Route path="menus" element={<MenusPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="sale" element={<SalesPage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="notification" element={<NotificationPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminMembersPage />} />
            <Route path="partners" element={<AdminPartnersPage />} />
            <Route path="matching" element={<AdminMatchingPage />} />
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
