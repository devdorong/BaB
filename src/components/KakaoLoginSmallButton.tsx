import { RiKakaoTalkFill } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

interface KakaoLoginSmallButtonProps {
  children?: React.ReactNode;
  onError?: (error?: string) => void;
}
const KakaoLoginSmallButton = ({ onError }: KakaoLoginSmallButtonProps) => {
  // 카카오 로그인 사용
  const { signInWithKakao } = useAuth();

  // 카카오 로그인 실행
  const handlekakaoLogin = async () => {
    try {
      const { error } = await signInWithKakao();
      if (error && onError) {
        console.log('카카오 로그인 에러 메시지 : ', error);
        onError(error);
      }
    } catch (err) {
      console.log('카카오 로그인 오류 : ', err);
    }
  };

  return (
    <div
      className="flex w-[40px] h-[40px] justify-center items-center pw-[8px] py-[8px] bg-[#FBE300] rounded-[20px] cursor-pointer"
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#fdd835';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#fee500';
      }}
      onClick={handlekakaoLogin}
    >
      {/* 카카오 아이콘 SVG */}
      <RiKakaoTalkFill size={24} />
    </div>
  );
};

export default KakaoLoginSmallButton;
