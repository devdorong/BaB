import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../types/bobType';
import { getProfile } from '../lib/propile';
import LoadingDiv from './LoadingDiv';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'partner')[]; // 멤버 제외
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const data = await getProfile(user.id);
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (loading) return <LoadingDiv />;

  // 로그인 안 되어있으면 로그인 페이지로
  if (!user) {
    return <Navigate to="/partner/login" replace />;
  }

  // role 검사
  if (!profile || !allowedRoles.includes(profile.role as 'admin' | 'partner')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
