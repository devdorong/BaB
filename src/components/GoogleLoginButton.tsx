import { useAuth } from '../contexts/AuthContext';

interface GoogleLoginButtonProps {
  children?: React.ReactNode;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}
const GoogleLoginButton = ({ onError, onSuccess }: GoogleLoginButtonProps) => {
  // 구글 로그인 사용
  const { signInWithGoogle } = useAuth();
  // 구글 로그인 실행
  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.log('구글 로그인 에러 메시지 : ', error);
        if (onError) {
          onError(error);
        }
      } else {
        console.log('구글 로그인 성공');
        if (onSuccess) {
          onSuccess('구글 로그인이 성공했습니다.');
        }
      }
    } catch (err) {
      console.log('구글 로그인 오류 : ', err);
    }
  };
  return (
    <button
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#fff',
        color: '#333',
        border: '1px solid #dadce0',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#f8f9fa';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#fff';
      }}
      onClick={handleGoogleLogin}
    >
      {/* 구글 아이콘 SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="<http://www.w3.org/2000/svg>"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Google 로그인
    </button>
  );
};

export default GoogleLoginButton;
