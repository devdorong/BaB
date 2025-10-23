import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedMemberRouteProps {
  children: React.ReactNode;
}

export const ProtectedMemberRoute = ({ children }: ProtectedMemberRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/member/login" state={{ from: location }} replace />;
  }

  // 로그인되어 있으면 정상 렌더링
  return <>{children}</>;
};
