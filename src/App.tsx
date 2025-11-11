import { lazy, Suspense } from 'react';
import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PointProvider } from './contexts/PointContext';
import { DirectChatProider } from './contexts/DirectChatContext';
import { MatchingProvider } from './contexts/MatchingContext';
import { ChatNotificationProvider } from './contexts/ChatNotificationContext';
import { MenusProvider } from './contexts/MenuContext';
import { NotificationRealTimeProvider } from './contexts/NotificationContext';
import { PartnerRestaurantProvider } from './contexts/PartnerRestaurantContext';
import { PartnerSignupProvider } from './contexts/PartnerSignupContext';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
import { Toaster } from './components/ui/sonner';
import './index.css';
import './components/member/chat/chat.css';

import ProtectedRoute from './components/ProtectedRoute';
import { ProtectedMemberRoute } from './components/ProtectedMemberRoute';

import AdminLayout from './layout/AdminLayout';
import BareLayout from './layout/BareLayout';
import MemberLayout from './layout/MemberLayout';
import PartnerLayout from './layout/PartnerLayout';
import LoadingDiv from './components/LoadingDiv';

const IndexPage = lazy(() => import('./pages/IndexPage'));
const NotFound = lazy(() => import('./pages/NotFoundPage'));
const ConfirmPage = lazy(() => import('./pages/auth/ConfirmPage'));

// Auth Pages
const MemberLoginPage = lazy(() => import('./pages/MemberLoginPage'));
const MemberSignupPage = lazy(() => import('./pages/MemberSignupPage'));
const PartnerLoginPage = lazy(() => import('./pages/PartnerLoginPage'));
const PartnerSignupPage = lazy(() => import('./pages/PartnerSignupPage'));

// Policy Pages
const TermsofServicePage = lazy(() => import('./pages/TermsofServicePage'));
const PersonalPolicyPage = lazy(() => import('./pages/PersonalPolicyPage'));

// Social Pages
const InsratgramPage = lazy(() => import('./pages/InsratgramPage'));
const KaKaoPage = lazy(() => import('./pages/KaKaoPage'));

// Member Pages
const MemberPage = lazy(() => import('./pages/member/MemberPage'));
const EventPage = lazy(() => import('./pages/member/EventPage'));
const SupportPage = lazy(() => import('./pages/member/SupportPage'));

// Member - Matching
const MatchingListPage = lazy(() => import('./pages/member/matchings/MatchingListPage'));
const MatchingWritePage = lazy(() => import('./pages/member/matchings/MatchingWritePage'));
const MatchingDetailPage = lazy(() => import('./pages/member/matchings/MatchingDetailPage'));
const MatchingEditPage = lazy(() => import('./pages/member/matchings/MatchingEditPage'));

// Member - Community
const CommunityPage = lazy(() => import('./pages/member/communitys/CommunityPage'));
const CommunityWritePage = lazy(() => import('./pages/member/communitys/CommunityWritePage'));
const CommunityDetailPage = lazy(() => import('./pages/member/communitys/CommunityDetailPage'));
const CommunityEditPage = lazy(() => import('./pages/member/communitys/CommunityEditPage'));

// Member - Reviews
const ReviewsPage = lazy(() => import('./pages/member/reviews/ReviewsPage'));
const ReviewDetailPage = lazy(() => import('./pages/member/reviews/ReviewDetailPage'));

// Member - Profile
const ProfilePage = lazy(() => import('./pages/member/profiles/ProfilePage'));
const EditPage = lazy(() => import('./pages/member/profiles/EditPage'));
const InterestPage = lazy(() => import('./pages/member/profiles/InterestPage'));
const ChatPage = lazy(() => import('./pages/member/profiles/ChatPage'));
const PointPage = lazy(() => import('./pages/member/profiles/PointPage'));
const MyReviewPage = lazy(() => import('./pages/member/profiles/MyReviewPage'));
const MyWritePage = lazy(() => import('./pages/member/profiles/MyWritePage'));
const FavoritePage = lazy(() => import('./pages/member/profiles/FavoritePage'));
const RecentMatchingPage = lazy(() => import('./pages/member/profiles/RecentMatchingPage'));
const HelpPage = lazy(() => import('./pages/member/profiles/HelpPage'));
const BlockPage = lazy(() => import('./pages/member/profiles/BlockPage'));

// Partner Pages
const DashboardPage = lazy(() => import('./pages/partner/DashboardPage'));
const RestaurantPage = lazy(() => import('./pages/partner/RestaurantPage'));
const MenusPage = lazy(() => import('./pages/partner/MenusPage'));
const OrdersPage = lazy(() => import('./pages/partner/OrdersPage'));
const SalesPage = lazy(() => import('./pages/partner/SalesPage'));
const ReviewPage = lazy(() => import('./pages/partner/ReviewPage'));
const NotificationPage = lazy(() => import('./pages/partner/NotificationPage'));
const SettingsPage = lazy(() => import('./pages/partner/SettingsPage'));

// Admin Pages
const AdminMembersPage = lazy(() => import('./pages/admin/AdminMembersPage'));
const AdminPartnersPage = lazy(() => import('./pages/admin/AdminPartnersPage'));
const AdminPartnerSignupDetailPage = lazy(
  () => import('./pages/admin/AdminPartnerSignupDetailPage'),
);
const AdminMatchingPage = lazy(() => import('./pages/admin/AdminMatchingPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

const LayoutWithAnalytics = ({ children }: { children: React.ReactNode }) => {
  useGoogleAnalytics();
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
                      <Suspense fallback={<LoadingDiv />}>
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
                      </Suspense>
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
