import { useAuth } from '../contexts/AuthContext';
import { GoogleIconSvg } from '../ui/jy/IconSvg';

interface GoogleLoginSmallButtonProps {
  children?: React.ReactNode;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}
const GoogleLoginSmallButton = ({ onError, onSuccess }: GoogleLoginSmallButtonProps) => {
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
    <div
      className="flex w-[40px] h-[40px] justify-center items-center pw-[8px] py-[8px] bg-white rounded-[20px] cursor-pointer"
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#f8f9fa';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#fff';
      }}
      onClick={handleGoogleLogin}
    >
      {/* 구글 아이콘 SVG */}
      <GoogleIconSvg />
    </div>
  );
};

export default GoogleLoginSmallButton;
