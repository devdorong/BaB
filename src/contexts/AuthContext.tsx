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

  // 카카오 로그인 함수
  signInWithKakao: () => Promise<{ error?: string }>;
  // 카카오 계정 연동 해제 함수
  unlinkKakaoAccount: () => Promise<{ error?: string; success?: boolean; message?: string }>;
  // 이메일 중복 확인 함수
  checkEmailExists: (email: string) => Promise<{ exists: boolean; error?: string }>;
  // 구글 로그인 함수
  signInWithGoogle: () => Promise<{ error?: string }>;

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
        const isKakaoLogin = user.app_metadata.provider === 'kakao';
        let nickName = user.user_metadata.nickName;
        if (isKakaoLogin) {
          nickName =
            user.user_metadata.full_name ||
            user.user_metadata.name ||
            user.user_metadata.nickname ||
            user.email?.split('@')[0] ||
            '카카오 사용자';
        } else {
          nickName = user.user_metadata.nickName ?? '';
        }

        const newProfile: ProfileInsert = {
          id: user.id,
          name: user.user_metadata?.name ?? '',
          nickname: user.user_metadata.nickName ?? '',
          phone: user.user_metadata?.phone ?? '',
          gender: user.user_metadata?.gender ?? true,
          birth: user.user_metadata?.birth ?? '2000-01-01',
        };
        await createProfile(newProfile);
      }

      // // 출석체크
      // const pointResult = await givePoint();

      // ✅ 오늘 출석 안 했을 때만 givePoint 호출
      const alreadyChecked = sessionStorage.getItem(`dailyLogin:${user.id}`);
      if (!alreadyChecked) {
        const pointResult = await givePoint();
        if (pointResult) {
          sessionStorage.setItem(`dailyLogin:${user.id}`, 'true');
        }
      }
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

  // 이메일 중복 확인 함수
  // - 회원 가입시에 이메일을 이용해서 먼저 파악 후, 회원가입 시도
  // - 결과에 따라서 메시지를 다양하게 출력을 한다 라는 시나리오
  // - 좀 위험한 것은 error.message 를 문자열로 비교한 것이 좀 불안함.
  const checkEmailExists: AuthContextType['checkEmailExists'] = async email => {
    try {
      // 1번 방법 : supabase auth 에서 이메일 중복 확인
      // - 일단 가짜 데이터로 회원가입을 시도하고, 그 결과로 이메일 존재를 확인한다.
      // - 이메일이 존재하지만, 비밀번호가 틀린 경우
      // - 이메일이 존재하지 않는 경우
      const { error, data } = await supabase.auth.signUp({
        email: email,
        password: '더미패스워드입니다.', // 더미 비밀번호로 로그인 시도
        options: {
          data: {
            temp_check: true, // 임시 확인용 플래그
          },
        },
      });
      if (error) {
        // 이메일이 존재하지만 비밀번호가 틀린경우
        if (
          error.message.includes('already registered') ||
          error.message.includes('User already registered') ||
          error.message.includes('already been registered') ||
          error.message.includes('already exists')
        ) {
          return { exists: true }; // 이미 존재하는 이메일이다.
        }
      }
      // 또 다른 오류인 경우
      if (data.user) {
        await supabase.auth.signOut(); // 다른 오류라면 로그아웃 시켜버린다.
      }
      return { exists: false }; // 존재하지 않는 이메일 입니다.
    } catch (err) {
      console.log(`이메일 중복 확인 오류 : ${err}`);
      return { exists: false, error: '이메일 중복 확인 중 오류가 발생했습니다.' };
    }
  };

  // 카카오 로그인 함수
  const signInWithKakao: AuthContextType['signInWithKakao'] = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      // 로그인 실행후 이동옵션
      options: {
        redirectTo: `${window.location.origin}/member`,
      },
    });
    if (error) {
      return { error: error.message };
    }

    console.log(`카카오 로그인 성공 : `, data);
    return {};
  };

  // 카카오 계정 연동 해제 함수
  const unlinkKakaoAccount: AuthContextType['unlinkKakaoAccount'] = async () => {
    try {
      // 카카오 로그인 사용자인지 확인
      if (user?.app_metadata.provider !== 'kakao') {
        return { error: '카카오 로그인 사용자가 아닙니다.' };
      }
      // supabase 에서 카카오 연동 해제
      // 사용자의 카카오 identity 찾기
      const kakaoIdentity = user.identities?.find(item => item.provider === '카카오');
      if (!kakaoIdentity) {
        return { error: '카카오 계정 연동 정보를 찾을 수 없습니다.' };
      }
      // 사용자의 카카오 identity 찾기 성공
      const { error } = await supabase.auth.unlinkIdentity(kakaoIdentity);
      if (error) {
        console.log(`카카오 계정 연동 해제 실패 : ${error.message}`);
        return { error: '카카오 계정 연동 해제에 실패하였습니다.' };
      }
      // 계정 해제에 성공했다면
      return {
        success: true,
        message: '카카오 계정 연동이 해제되었습니다. 다시 로그인해주세요.',
      };
    } catch (err) {
      console.log(`카카오 계정 연동 해제 오류 : ${err}`);
      return { error: '카카오 계정 연동 해제 중 오류가 발생했습니다.' };
    }
  };

  // 구글 로그인 함수
  const signInWithGoogle: AuthContextType['signInWithGoogle'] = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 로그인 실행후 이동옵션
        redirectTo: `${window.location.origin}`,
      },
    });
    // 오류발생시 체크 해보자.
    if (error) {
      return { error: error.message };
    }
    console.log('구글 로그인 성공 : ', data);
    return {};
  };

  // 로그아웃
  const signOut: AuthContextType['signOut'] = async () => {
    await supabase.auth.signOut();
  };

  // 탈퇴기능은 추후 구현

  const value = {
    signUp,
    signIn,
    signOut,
    session,
    user,
    loading,
    checkEmailExists,
    signInWithKakao,
    signInWithGoogle,
    unlinkKakaoAccount,
  };
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
