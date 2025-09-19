import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { createPoint, GetPoint } from '../services/PointService';
import { usePoint } from './BabContext';
import { createProfile, getProfile } from '../lib/propile';
import type { ProfileInsert } from '../types/bobType';

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

  // 🚨 즉시 로딩 해제 + 5초 타이머
  useEffect(() => {
    console.log('🚨 즉시 로딩 해제 시작');

    // 즉시 로딩 해제
    setLoading(false);
    console.log('🚨 즉시 setLoading(false) 호출됨');

    // 추가 안전장치 타이머
    const timer = setTimeout(() => {
      console.log('🚨 5초 후 다시 setLoading(false) 호출');
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // 로그인 후 처리 (프로필/포인트 생성) - 디버그 로그 추가
  const handlePostLogin = async (user: User) => {
    console.log('🔄 handlePostLogin 시작:', user.id);
    try {
      console.log('📋 프로필 조회 시작...');
      const profile = await getProfile(user.id);
      console.log('📋 프로필 조회 완료:', profile ? '존재' : '없음');

      if (!profile) {
        console.log('📝 새 프로필 생성 시작...');
        const newProfile: ProfileInsert = {
          id: user.id,
          name: user.user_metadata?.name ?? '',
          nickname: user.user_metadata?.nickName ?? '',
          phone: user.user_metadata?.phone ?? '',
          gender: user.user_metadata?.gender ?? true,
          birth: user.user_metadata?.birth ?? '2000-01-01',
        };
        const createResult = await createProfile(newProfile);
        console.log('📝 새 프로필 생성 결과:', createResult);
      }

      console.log('💰 포인트 조회 시작...');
      const pointData = await GetPoint();
      console.log('💰 포인트 조회 완료:', pointData ? '존재' : '없음');

      if (!pointData) {
        console.log('💰 새 포인트 생성 시작...');
        await createPoint();
        console.log('💰 새 포인트 생성 완료');
      }

      console.log('✅ handlePostLogin 완료');
    } catch (error) {
      console.error('❌ handlePostLogin 오류:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider 초기화 시작');

    const loadSession = async () => {
      console.log('🔍 세션 로드 시작...');
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ 세션 로드 에러:', error.message);
        }

        console.log('📊 세션 데이터:', data.session ? '있음' : '없음');
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);

        // ✅ 백그라운드에서 실행 (블로킹하지 않음)
        if (data.session?.user) {
          console.log('🔄 기존 세션으로 post-login 실행');
          handlePostLogin(data.session.user).catch(console.error);
        }
      } catch (err) {
        console.error('❌ loadSession 오류:', err);
      } finally {
        console.log('✅ 초기 로딩 완료');
        setLoading(false); // 🔥 항상 실행됨
      }
    };

    loadSession();

    // Auth state 변경 리스너
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('🔄 Auth state 변경:', event, newSession ? '세션 있음' : '세션 없음');

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('🔑 로그인 이벤트 - post-login 실행');
        // 백그라운드에서 실행
        handlePostLogin(newSession.user).catch(console.error);
      }

      if (event === 'SIGNED_OUT') {
        console.log('👋 로그아웃 이벤트');
        setSession(null);
        setUser(null);
      }

      // 🔥 여기서도 로딩 완료 처리
      setLoading(false);
    });

    return () => {
      console.log('🧹 AuthProvider 정리');
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

  console.log('🎯 현재 상태 - loading:', loading, 'user:', user ? '있음' : '없음');

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
