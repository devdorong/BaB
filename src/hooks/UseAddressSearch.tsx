import { useState } from 'react';
import { useKakaoLoader } from './useKakaoLoader';
import { useDaumPostcodeLoader } from './useDaumPostcodeLoader';
import { useModal } from '../ui/sdj/ModalState';

export function useAddressSearch() {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { closeModal, modal, openModal } = useModal();

  // 두 로더 훅 호출
  const kakaoReady = useKakaoLoader();
  const daumReady = useDaumPostcodeLoader();

  const openPostcode = () => {
    if (!daumReady || !window.daum?.Postcode) {
      alert('Daum Postcode API가 아직 로드되지 않았습니다.');
      openModal(
        '주소 알림',
        'Daum Postcode API가 아직 로드되지 않았습니다.\n잠시후 다시 시도해주세요',
        '',
        '확인',
        () => closeModal(),
      );
      return;
    }
    if (!kakaoReady) {
      alert('Kakao Maps API가 아직 로드되지 않았습니다.');
      openModal(
        '주소 알림',
        'Kakao Maps API가 아직 로드되지 않았습니다.\n잠시후 다시 시도해주세요',
        '',
        '확인',
        () => closeModal(),
      );
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

  return { address, latitude, longitude, openPostcode, closeModal, modal, openModal };
}
