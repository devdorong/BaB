import type { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { PointProvider } from './contexts/PointContext';
import AdminLayout from './layout/AdminLayout';
import BareLayout from './layout/BareLayout';
import MemberLayout from './layout/MemberLayout';
import PartnerLayout from './layout/PartnerLayout';
import { createProfile } from './lib/propile';
import { supabase } from './lib/supabase';
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
import MatchingDetailEditPage from './pages/member/matchings/MatchingEditPage';
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
import { GetOrCreatePoint } from './services/PointService';
import type { ProfileInsert } from './types/bobType';

import { PartnerSignupProvider } from './contexts/PartnerSignupContext';

import './components/member/chat/chat.css';
import { DirectChatProider } from './contexts/DirectChatContext';
import CommunityEditPage from './pages/member/communitys/CommunityEditPage';
import MyReviewPage from './pages/member/profiles/MyReviewPage';
import { MatchingProvider } from './contexts/MatchingContext';
import MatchingEditPage from './pages/member/matchings/MatchingEditPage';

function App() {
  // 인증 메일 확인후, 프로필 생성
  useEffect(() => {
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;

        // user_metadata에서 프로필 생성 필요 여부 확인
        if (user.user_metadata?.needsProfileCreation) {
          try {
            // 1. 프로필 생성
            const newUser: ProfileInsert = {
              id: user.id,
              name: user.user_metadata.name,
              nickname: user.user_metadata.nickName,
              phone: user.user_metadata.phone,
              gender: user.user_metadata.gender,
              birth: user.user_metadata.birth,
            };

            const profileResult = await createProfile(newUser);

            if (profileResult) {
              // 2. 포인트 생성
              const pointResult = await GetOrCreatePoint();

              if (pointResult) {
                console.log('프로필과 포인트 생성 완료');

                // 3. user_metadata에서 needsProfileCreation 플래그 제거
                await supabase.auth.updateUser({
                  data: {
                    ...user.user_metadata,
                    needsProfileCreation: false,
                  },
                });
              }
            }
          } catch (error) {
            console.error('프로필 생성 중 오류:', error);
          }
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <DirectChatProider>
        <PointProvider>
          <MatchingProvider>
            <MatchingProvider>
              <Router
                future={{
                  v7_relativeSplatPath: true,
                  v7_startTransition: true,
                }}
              >
                <Routes>
                  <Route path="/" element={<IndexPage />} />

                  {/* Member */}
                  <Route path="/member" element={<MemberLayout />}>
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
                    <Route path="profile">
                      <Route index element={<ProfilePage />} />
                      <Route path="edit" element={<EditPage />} />
                      <Route path="interest" element={<InterestPage />} />
                      <Route path="chat" element={<ChatPage />} />
                      <Route path="point" element={<PointPage />} />
                      <Route path="myreviews" element={<MyReviewPage />} />
                      <Route path="favorite" element={<FavoritePage />} />
                      <Route path="recentmatching" element={<RecentMatchingPage />} />
                      <Route path="block" element={<BlockPage />} />
                    </Route>
                  </Route>

                  {/* 이용약관/개인정보처리방침 */}
                  <Route path="/" element={<MemberLayout />}>
                    <Route path="privacy" element={<TermsofServicePage />} />
                    <Route path="perpolicy" element={<PersonalPolicyPage />} />
                  </Route>

                  {/* 소셜 */}
                  <Route path="/instar" element={<InsratgramPage />} />
                  <Route path="/kakao" element={<KaKaoPage />} />

                  {/* 헤더없는 화면 */}
                  <Route element={<BareLayout />}>
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
                    <Route path="matching" element={<AdminMatchingPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                  </Route>

                  {/* Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </MatchingProvider>
          </MatchingProvider>
        </PointProvider>
      </DirectChatProider>
    </AuthProvider>
  );
}

export default App;
