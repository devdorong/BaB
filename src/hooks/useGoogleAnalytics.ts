import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

// 타입 선언을 훅 파일에 직접 추가
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>,
    ) => void;
    dataLayer: any[];
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

export const useGoogleAnalytics = () => {
  const location = useLocation();

  // GA4 초기화 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    if (MEASUREMENT_ID) {
      // 테스트를 위해 로컬에서도 활성화 (나중에 주석 처리)
      if (window.location.hostname === 'localhost') {
        // console.log('🚫 로컬 환경 - GA4 초기화 건너뜀');
        return;
      }

      ReactGA.initialize(MEASUREMENT_ID); // debug 옵션 제거
      // console.log('✅ GA4 초기화 완료:', MEASUREMENT_ID);
    }
  }, []); // 빈 배열로 한 번만 실행

  // 페이지 변경 시마다 페이지뷰 전송
  useEffect(() => {
    if (MEASUREMENT_ID) {
      // localhost 체크 제거
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
      });
      // console.log('📊 페이지뷰 전송:', location.pathname);
    }
  }, [location]); // location이 변경될 때마다 실행
};

// 커스텀 이벤트 추적 함수
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (MEASUREMENT_ID) {
    // localhost 체크 제거
    ReactGA.event(eventName, parameters);
    // console.log('🎯 이벤트 전송:', eventName, parameters);
  }
};

// 나머지 함수들은 동일
export const trackOrderEvent = (menuItem: string, tableNumber?: number) => {
  trackEvent('order_placed', {
    menu_item: menuItem,
    table_number: tableNumber,
    page: window.location.pathname,
  });
};

export const trackTableSelect = (tableNumber: number) => {
  trackEvent('table_selected', {
    table_number: tableNumber,
    page: window.location.pathname,
  });
};

export const trackLoginEvent = () => {
  trackEvent('login');
};

export const trackSignupEvent = () => {
  trackEvent('sign_up');
};
