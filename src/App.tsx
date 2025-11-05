import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { PointProvider } from './contexts/PointContext';
import './index.css';
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
import InsratgramPage from './pages/InsratgramPage';
import KaKaoPage from './pages/KaKaoPage';
import CommunityDetailPage from './pages/member/communitys/CommunityDetailPage';
import CommunityPage from './pages/member/communitys/CommunityPage';
import CommunityWritePage from './pages/member/communitys/CommunityWritePage';
import EventPage from './pages/member/EventPage';
import MatchingDetailPage from './pages/member/matchings/MatchingDetailPage';
import MatchingListPage from './pages/member/matchings/MatchingListPage';
import MatchingWritePage from './pages/member/matchings/MatchingWritePage';
import MemberPage from './pages/member/MemberPage';
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
import PersonalPolicyPage from './pages/PersonalPolicyPage';
import TermsofServicePage from './pages/TermsofServicePage';

import { PartnerSignupProvider } from './contexts/PartnerSignupContext';

import './components/member/chat/chat.css';
import { DirectChatProider } from './contexts/DirectChatContext';
import { MatchingProvider } from './contexts/MatchingContext';
import CommunityEditPage from './pages/member/communitys/CommunityEditPage';
import MatchingEditPage from './pages/member/matchings/MatchingEditPage';
import MyReviewPage from './pages/member/profiles/MyReviewPage';

import MyWritePage from './pages/member/profiles/MyWritePage';

import { ProtectedMemberRoute } from './components/ProtectedMemberRoute';
import { Toaster } from './components/ui/sonner';
import { ChatNotificationProvider } from './contexts/ChatNotificationContext';
import { MenusProvider } from './contexts/MenuContext';
import { NotificationRealTimeProvider } from './contexts/NotificationContext';
import { PartnerRestaurantProvider } from './contexts/PartnerRestaurantContext';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
import ConfirmPage from './pages/auth/ConfirmPage';
import HelpPage from './pages/member/profiles/HelpPage';
import AdminPartnerSignupDetailPage from './pages/admin/AdminPartnerSignupDetailPage';

const LayoutWithAnalytics = ({ children }: { children: React.ReactNode }) => {
  useGoogleAnalytics(); // Router 컨텍스트 내부에서 사용
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <DirectChatProider>
        <PointProvider>
          <MatchingProvider>
            <PartnerRestaurantProvider>
              <MenusProvider>
                <NotificationRealTimeProvider>
                  <ChatNotificationProvider>
                    <Router
                      future={{
                        v7_relativeSplatPath: true,
                        v7_startTransition: true,
                      }}
                    >
                      <Routes>
                        <Route path="/" element={<IndexPage />} />
                        {/* Member */}
                        <Route
                          path="/member"
                          element={
                            <LayoutWithAnalytics>
                              <MemberLayout />
                            </LayoutWithAnalytics>
                          }
                        >
                          <Route index element={<MemberPage />} />
                          <Route path="matching">
                            <Route index element={<MatchingListPage />} />
                            <Route path="write" element={<MatchingWritePage />} />
                            <Route path=":id" element={<MatchingDetailPage />} />
                            <Route path="edit/:id" element={<MatchingEditPage />} />
                          </Route>
                          <Route path="community">
                            <Route index element={<CommunityPage />} />
                            <Route path="write" element={<CommunityWritePage />} />
                            <Route path="detail/:id" element={<CommunityDetailPage />} />
                            <Route path="edit/:id" element={<CommunityEditPage />} />
                          </Route>
                          <Route path="reviews">
                            <Route index element={<ReviewsPage />} />
                            <Route path=":id" element={<ReviewDetailPage />} />
                          </Route>
                          <Route path="events" element={<EventPage />} />
                          <Route path="support" element={<SupportPage />} />
                          <Route
                            path="profile/*"
                            element={
                              <ProtectedMemberRoute>
                                <Outlet />
                              </ProtectedMemberRoute>
                            }
                          >
                            <Route index element={<ProfilePage />} />
                            <Route path="edit" element={<EditPage />} />
                            <Route path="interest" element={<InterestPage />} />
                            <Route path="chat" element={<ChatPage />} />
                            <Route path="point" element={<PointPage />} />
                            <Route path="myreviews" element={<MyReviewPage />} />
                            <Route path="mywrite" element={<MyWritePage />} />
                            <Route path="favorite" element={<FavoritePage />} />
                            <Route path="recentmatching" element={<RecentMatchingPage />} />
                            <Route path="helps" element={<HelpPage />} />
                            <Route path="block" element={<BlockPage />} />
                          </Route>
                        </Route>

                        {/* 이용약관/개인정보처리방침 */}
                        <Route
                          path="/"
                          element={
                            <LayoutWithAnalytics>
                              <MemberLayout />
                            </LayoutWithAnalytics>
                          }
                        >
                          <Route path="privacy" element={<TermsofServicePage />} />
                          <Route path="perpolicy" element={<PersonalPolicyPage />} />
                        </Route>

                        {/* 소셜 */}
                        <Route path="/instar" element={<InsratgramPage />} />
                        <Route path="/kakao" element={<KaKaoPage />} />

                        {/* 헤더없는 화면 */}
                        <Route
                          element={
                            <LayoutWithAnalytics>
                              <BareLayout />
                            </LayoutWithAnalytics>
                          }
                        >
                          <Route path="member/login" element={<MemberLoginPage />} />
                          <Route path="member/signup" element={<MemberSignupPage />} />
                          <Route path="partner/login" element={<PartnerLoginPage />} />
                          <Route
                            path="partner/signup"
                            element={
                              <PartnerSignupProvider>
                                <PartnerSignupPage />
                              </PartnerSignupProvider>
                            }
                          />
                        </Route>

                        {/* Partner */}
                        <Route
                          path="/partner"
                          element={
                            <ProtectedRoute allowedRoles={['partner', 'admin']}>
                              {' '}
                              <PartnerLayout />
                            </ProtectedRoute>
                          }
                        >
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
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute allowedRoles={['admin']}>
                              <AdminLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<AdminMembersPage />} />
                          <Route path="partners" element={<AdminPartnersPage />} />
                          <Route path="partners/:id" element={<AdminPartnerSignupDetailPage />} />
                          <Route path="matching" element={<AdminMatchingPage />} />
                          <Route path="reports" element={<AdminReportsPage />} />
                          <Route path="settings" element={<AdminSettingsPage />} />
                        </Route>
                        {/* confirm */}
                        <Route path="/auth/confirm" element={<ConfirmPage />} />
                        {/* Not Found */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Router>
                    <Toaster />
                  </ChatNotificationProvider>
                </NotificationRealTimeProvider>
              </MenusProvider>
            </PartnerRestaurantProvider>
          </MatchingProvider>
        </PointProvider>
      </DirectChatProider>
    </AuthProvider>
  );
}

export default App;
