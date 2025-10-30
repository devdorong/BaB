// ConfirmPage.tsx - 전면 교체해도 됩니다
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ConfirmPage() {
  const [message, setMessage] = useState('이메일 인증 중입니다...');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tokenHash = params.get('token_hash');
        const type = (params.get('type') || 'signup') as 'signup' | 'email';

        if (!tokenHash) {
          setMessage('잘못된 접근입니다. (토큰 없음)');
          return;
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });

        if (error) {
          console.error('인증 오류:', error.message);
          setMessage('이메일 인증에 실패했습니다.');
          return;
        }

        // ✅ 여기서 실제 로그인 세션이 생겼는지 확인
        if (data.session) {
          setMessage('이메일 인증이 완료되었습니다! 🎉 로그인 확인 중...');
        } else {
          // 이미 인증된 링크를 다시 누른 경우 등
          // 세션이 없을 수 있으니 다시 세션 로드
          const { data: sess } = await supabase.auth.getSession(); // 세션 재확인
          setMessage('이메일 인증이 완료되었습니다! 🎉');
          setTimeout(() => navigate('/'), 1000);
        }

        // 짧게 대기 후 홈으로
        setTimeout(() => navigate('/'), 1200);
      } catch (e) {
        console.error(e);
        setMessage('인증 처리 중 오류가 발생했습니다.');
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h2 className="text-xl font-bold mb-3">BaB 이메일 인증</h2>
      <p className="text-gray-600">{message}</p>
      <button onClick={() => navigate('/')}>홈으로</button>
    </div>
  );
}
