import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function ConfirmPage() {
  const TOTAL = 3; // 3,2,1
  const [count, setCount] = useState<number>(TOTAL);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // 진행률 0~100
  const progress = useMemo(() => {
    if (done) return 100;
    return ((TOTAL - count) / TOTAL) * 100;
  }, [count, done]);

  useEffect(() => {
    // 3초 동안 3 -> 2 -> 1을 1초 간격으로 보여준 뒤 완료로 전환
    const t1 = setTimeout(() => setCount(2), 1000);
    const t2 = setTimeout(() => setCount(1), 2000);
    const t3 = setTimeout(() => setDone(true), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleGoLogin = async () => {
    try {
      setBusy(true);
      await supabase.auth.signOut();
      navigate('/member/login', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh/0.9)] flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 헤더 */}
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">BaB 이메일 인증</h1>
            <p className="mt-2 text-sm text-gray-500">잠시만 기다려 주세요</p>
          </div>

          {/* 진행 바 */}
          <div className="px-8">
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className="h-full bg-bab-500 w-0" // 초기 width 0
                initial={{ width: 0 }} // 모션 초기값도 0
                animate={{ width: `${progress}%` }} // 진행률에 맞춰 증가
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* 카운트다운 / 완료 메시지 */}
          <div className="px-8 py-10">
            <div className="flex flex-col items-center justify-center">
              <div className="h-32 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!done ? (
                    <motion.div
                      key={`count-${count}`}
                      initial={{ opacity: 0, scale: 0.85, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -8 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="text-7xl md:text-8xl font-black tracking-tight text-bab-500"
                    >
                      {count}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="text-center"
                    >
                      <p className="text-xl font-semibold">회원가입이 완료되었습니다.</p>
                      <p className="mt-2 text-gray-600">로그인을 통해 BaB와 함께하세요.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 액션 버튼 */}
              <div className="mt-8 w-full grid grid-cols-1 gap-3">
                <button
                  onClick={handleGoLogin}
                  disabled={!done || busy}
                  className={[
                    'w-full py-3 rounded-xl font-semibold transition',
                    done && !busy
                      ? 'bg-bab-500 text-white hover:brightness-110'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed',
                  ].join(' ')}
                >
                  {busy ? '이동 중...' : '로그인하러 가기'}
                </button>

                {/* 홈으로 이동을 쓰고 싶다면 주석 해제 */}
                {/* <button
                  onClick={() => navigate('/', { replace: true })}
                  className="w-full py-3 rounded-xl font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
                >
                  홈으로
                </button> */}
              </div>
            </div>
          </div>

          {/* 바닥 장식 */}
          <div className="h-1 w-full bg-gradient-to-r from-bab-500 via-orange-400 to-yellow-300" />
        </div>
      </div>
    </div>
  );
}
