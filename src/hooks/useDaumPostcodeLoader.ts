import { useEffect, useState } from 'react';

export function useDaumPostcodeLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.daum?.Postcode) {
      setReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'daum-postcode-sdk';
    script.async = true;
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

    script.onload = () => setReady(true);
    script.onerror = () => console.error('Daum Postcode API 로딩 실패');

    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  return ready;
}
