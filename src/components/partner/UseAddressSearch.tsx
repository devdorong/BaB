import { useState } from 'react';

export function useAddressSearch() {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      alert('Daum Postcode API가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const selectedAddress = data.address;
        setAddress(selectedAddress);

        if (!window.kakao?.maps?.services) {
          alert('Kakao Maps API가 아직 로드되지 않았습니다.');
          return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(selectedAddress, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { x, y } = result[0];
            setLongitude(x);
            setLatitude(y);
          } else {
            console.error('주소 → 좌표 변환 실패:', status);
          }
        });
      },
    }).open();
  };

  return { address, latitude, longitude, openPostcode };
}
