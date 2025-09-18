import { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

export function useKakaoLoader(libs = 'services,clusterer') {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const APP_KEY = import.meta.env.VITE_KKO_MAP_JS_API_KEY as string | undefined;
    if (!APP_KEY) {
      console.error('VITE_KKO_MAP_JS_API_KEY 가 설정되지 않았습니다. .env 파일을 확인하세요.');
      return;
    }

    // 이미 kakao 객체가 있으면 재활용
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => setReady(true));
      return;
    }

    // 이미 추가된 스크립트가 있으면 그 로딩 완료를 기다림
    const EXISTING = document.getElementById('kakao-map-sdk') as HTMLScriptElement | null;
    const onLoad = () => {
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => setReady(true));
      } else {
        console.error('kakao.maps.load 를 찾을 수 없습니다.');
      }
    };

    if (EXISTING) {
      if (EXISTING.dataset.loaded === 'true') {
        onLoad();
      } else {
        EXISTING.addEventListener('load', onLoad);
      }
      return () => EXISTING.removeEventListener('load', onLoad);
    }

    // 스크립트 최초 주입
    const script = document.createElement('script');
    script.id = 'kakao-map-sdk';
    script.async = true;
    script.defer = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false&libraries=${libs}`;
    script.onload = () => {
      script.dataset.loaded = 'true';
      onLoad();
    };
    script.onerror = () => {
      console.error('Kakao Map SDK 로딩 실패');
    };
    document.head.appendChild(script);

    return () => {
      // HMR 중복리스너 방지
      script.onload = null;
      script.onerror = null;
    };
  }, [libs]);

  return ready;
}
