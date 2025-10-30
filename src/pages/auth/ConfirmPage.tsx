import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ConfirmPage() {
  const [message, setMessage] = useState('이메일 인증 중입니다...');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        console.log('=== URL 전체 ===', window.location.href);

        const params = new URLSearchParams(window.location.search);
        const token_hash = params.get('token_hash');
        const type = params.get('type');

        console.log('추출된 파라미터:', { token_hash, type });

        if (!token_hash || !type) {
          console.error('파라미터 누락:', { token_hash, type });
          setMessage('잘못된 인증 링크입니다.');
          setIsError(true);
          return;
        }

        console.log('verifyOtp 호출 전...');

        // type을 'email'로 명시
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email', // 명시적으로 'email' 지정
        });

        console.log('verifyOtp 결과:', { data, error });

        if (error) {
          console.error('verifyOtp 에러:', error);
          setMessage(`인증 실패: ${error.message}`);
          setIsError(true);
          return;
        }

        console.log('인증 성공! 세션:', data.session?.user.email);
        setMessage('✅ 이메일 인증이 완료되었습니다!');

        // 2초 후 홈으로 이동
        setTimeout(() => {
          navigate('/member');
        }, 2000);
      } catch (err: any) {
        console.error('예외 발생:', err);
        setMessage(`오류: ${err.message || '알 수 없는 오류'}`);
        setIsError(true);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-bg-bg px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">BaB 이메일 인증</h2>
        <p className={`text-lg ${isError ? 'text-red-600' : 'text-gray-700'}`}>{message}</p>

        {isError && (
          <button
            onClick={() => navigate('/member/signup')}
            className="mt-4 w-full bg-bab-500 text-white py-3 rounded-lg"
          >
            다시 가입하기
          </button>
        )}
      </div>
    </div>
  );
}
