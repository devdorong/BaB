import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createProfile, getProfile } from '../lib/propile';
import { supabase } from '../lib/supabase';
import type { ProfileInsert } from '../types/bobType';
import { givePoint } from '../services/PointService';

type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  nickName: string;
  phone: string;
  gender: boolean;
  birth: string; // "YYYY-MM-DD"
};

type AuthContextType = {
  // 현재 사용자의 세션정보 (로그인 상태, 토큰)
  session: Session | null;
  // 현재 로그인 된 사용자 정보
  user: User | null;
  // 회원 가입 함수(이메일, 비밀번호) : 비동기라서
  signUp: (payload: SignUpPayload) => Promise<{ error?: string }>;
  // 회원 로그인 함수(이메일, 비밀번호) : 비동기라서
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  // 회원 로그아웃 함수
  signOut: () => Promise<void>;
  // 회원정보 로딩 상태
  loading: boolean;
  // 회원탈퇴 기능
  // deleteAccount: () => Promise<{ error?: string; success?: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children?: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 현재 사용자 세션
  const [session, setSession] = useState<Session | null>(null);
  // 현재 로그인한 사용자 정보
  const [user, setUser] = useState<User | null>(null);
  // 로딩 상태 추가
  const [loading, setLoading] = useState<boolean>(true);

  // 중복 처리 방지를 위한 ref
  const processingUsers = useRef<Set<string>>(new Set());

  // useEffect(() => {
  //   setLoading(false);

  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);

  // 로그인 후 처리 (프로필/포인트 생성) - 디버그 로그 추가
  const handlePostLogin = async (user: User) => {
    if (processingUsers.current.has(user.id)) {
      return;
    }

    processingUsers.current.add(user.id);

    try {
      const profile = await getProfile(user.id);

      if (!profile) {
        const newProfile: ProfileInsert = {
          id: user.id,
          name: user.user_metadata?.name ?? '',
          nickname: user.user_metadata?.nickName ?? '',
          phone: user.user_metadata?.phone ?? '',
          gender: user.user_metadata?.gender ?? true,
          birth: user.user_metadata?.birth ?? '2000-01-01',
        };
        await createProfile(newProfile);
      }

      // 출석체크
      const pointResult = await givePoint();
    } catch (error) {
      console.error('handlePostLogin 오류:', error);
    } finally {
      processingUsers.current.delete(user.id);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('세션 로드 에러:', error.message);
        }

        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);

        if (data.session?.user) {
          await handlePostLogin(data.session.user);
        }
      } catch (err) {
        console.error('loadSession 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Auth state 변경 리스너
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_IN' && newSession?.user) {
        handlePostLogin(newSession.user).catch(console.error);
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        processingUsers.current.clear();
      }

      setLoading(false);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // signUp - 오직 회원가입만 담당
  const signUp: AuthContextType['signUp'] = async payload => {
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          nickName: payload.nickName,
          phone: payload.phone,
          gender: payload.gender,
          birth: payload.birth,
        },
      },
    });

    if (error) return { error: error.message };
    return {};
  };

  // 로그인
  const signIn: AuthContextType['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut: AuthContextType['signOut'] = async () => {
    await supabase.auth.signOut();
  };

  // 탈퇴기능은 추후 구현

  const value = { signUp, signIn, signOut, session, user, loading };
  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>로딩 중...</div> : children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅 생성
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('AuthContext 가 없습니다.');
  }
  return ctx;
};
