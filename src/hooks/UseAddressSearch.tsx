import { useState } from 'react';
import { useKakaoLoader } from './useKakaoLoader';
import { useDaumPostcodeLoader } from './useDaumPostcodeLoader';

export function useAddressSearch() {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // 두 로더 훅 호출
  const kakaoReady = useKakaoLoader();
  const daumReady = useDaumPostcodeLoader();

  const openPostcode = () => {
    if (!daumReady) {
      alert('Daum Postcode API가 아직 로드되지 않았습니다.');
      return;
    }
    if (!kakaoReady) {
      alert('Kakao Maps API가 아직 로드되지 않았습니다.');
      return;
    }
    if (!window.daum?.Postcode) {
      alert('Daum Postcode API가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const selectedAddress = data.address;
        setAddress(selectedAddress);

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(selectedAddress, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { x, y } = result[0];
            setLongitude(Number(x));
            setLatitude(Number(y));
          } else {
            console.error('주소 → 좌표 변환 실패:', status);
          }
        });
      },
    }).open();
  };

  return { address, latitude, longitude, openPostcode };
}
