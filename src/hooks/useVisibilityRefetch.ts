import { useEffect } from 'react';

/**
 * 탭이 활성화될 때 데이터를 자동으로 재로딩하는 커스텀 훅
 * @param refetchFn - 데이터를 다시 불러오는 함수
 * @param enabled - 기능 활성화 여부 (기본값: true)
 */

export function useVisibilityRefetch(
  refetchFn: () => void | Promise<void>,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ 탭이 활성화됨 - 데이터 재로딩');
        refetchFn();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetchFn, enabled]);
}
