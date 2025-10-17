import { useEffect, useRef, useState } from 'react';
import { RiCloseLine, RiSearchLine } from 'react-icons/ri';
import { useModal } from '../../ui/sdj/ModalState';
import Modal from '../../ui/sdj/Modal';

interface SelectedPlace {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface MapSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: SelectedPlace) => void;
}

const MapSearchModal = ({ isOpen, onClose, onSelectPlace }: MapSearchModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [keyword, setKeyword] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlaceIdx, setSelectedPlaceIdx] = useState<number | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const { closeModal, modal, openModal } = useModal();

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    // 지도 초기화
    const mapOption = {
      center: new window.kakao!.maps.LatLng(35.86823232723134, 128.59396682562848),
      level: 3,
    };

    mapRef.current = new window.kakao!.maps.Map(mapContainer.current, mapOption);
  }, [isOpen]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const searchPlaces = () => {
    if (!keyword.trim()) {
      openModal('카카오맵', '검색어를 입력해주세요!', '닫기', '', () => closeModal());
    }

    if (!window.kakao?.maps?.services) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (result: any[], status: string) => {
      if (status === window.kakao!.maps.services.Status.OK) {
        setPlaces(result);
        setSelectedPlaceIdx(null);
        clearMarkers();

        // 마커 표시
        const bounds = new window.kakao!.maps.LatLngBounds();

        result.forEach((place, idx) => {
          const position = new window.kakao!.maps.LatLng(place.y, place.x);

          const marker = new window.kakao!.maps.Marker({
            position,
            title: place.place_name,
            image: createMarkerImage(idx),
            clickable: true,
          });

          marker.setMap(mapRef.current!);
          markersRef.current.push(marker);

          // 마커 클릭 이벤트
          window.kakao!.maps.event.addListener(marker, 'click', () => {
            setSelectedPlaceIdx(idx);
            mapRef.current?.setCenter(position);
          });

          bounds.extend(position);
        });

        mapRef.current?.setBounds(bounds);
      } else if (status === window.kakao!.maps.services.Status.ZERO_RESULT) {
        setPlaces([]);
      } else if (status === window.kakao!.maps.services.Status.ERROR) {
        openModal('오류', '검색 중 오류가 발생했습니다', '닫기', '', () => closeModal());
      }
    });
  };

  const createMarkerImage = (idx: number) => {
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
    const imageSize = new window.kakao!.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new window.kakao!.maps.Size(36, 691),
      spriteOrigin: new window.kakao!.maps.Point(0, idx * 46 + 10),
      offset: new window.kakao!.maps.Point(13, 37),
    };

    return new window.kakao!.maps.MarkerImage(imageSrc, imageSize, imgOptions);
  };

  const handleSelectPlace = (idx: number) => {
    const place = places[idx];
    const selectedPlace: SelectedPlace = {
      id: place.id,
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
    };

    onSelectPlace(selectedPlace);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[900px] h-[600px] flex flex-col shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">맛집 선택</h2>
          <button onClick={onClose} className="p-1 hover:bg-babgray-100 rounded-lg transition">
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* 검색 영역 */}
        <div className="flex gap-2 p-4 bg-babgray-50">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색할 맛집이름을 입력하세요"
            className="flex-1 px-4 py-2 rounded-lg border border-babgray-300 focus:outline-none focus:border-bab"
          />
          <button
            onClick={searchPlaces}
            className="px-4 py-2 bg-bab text-white rounded-lg hover:bg-bab-600 transition flex items-center gap-2"
          >
            <RiSearchLine size={18} />
            검색
          </button>
        </div>

        {/* 지도 + 리스트 */}
        <div className="flex flex-1 overflow-hidden px-4 gap-2 pb-4">
          {/* 지도 */}
          <div ref={mapContainer} className="flex-1" />

          {/* 검색 결과 리스트 */}
          <div className="w-80 overflow-y-auto">
            {places.length === 0 ? (
              <div className="p-4 text-center text-babgray-500">검색 결과가 없습니다</div>
            ) : (
              <ul className="">
                {places.map((place, idx) => (
                  <li
                    key={place.id}
                    onClick={() => {
                      setSelectedPlaceIdx(idx);
                      const position = new window.kakao!.maps.LatLng(place.y, place.x);
                      mapRef.current?.setCenter(position);
                    }}
                    className={`p-4 cursor-pointer transition border-t border-babgray-100 ${
                      selectedPlaceIdx === idx
                        ? 'bg-bab-50 border-l-4 border-l-bab'
                        : 'hover:bg-babgray-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-bab min-w-6">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-babgray-900 truncate">
                          {place.place_name}
                        </p>
                        <p className="text-xs text-babgray-600 truncate">
                          {place.road_address_name || place.address_name}
                        </p>
                        {place.phone && (
                          <p className="text-xs text-babgray-500 mt-1">{place.phone}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 p-4 border-t bg-babgray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-babgray-300 rounded-lg hover:bg-babgray-100 transition font-medium"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (selectedPlaceIdx !== null) {
                handleSelectPlace(selectedPlaceIdx);
              } else {
                openModal('카카오맵', '맛집을 선택해주세요!', '닫기', '', () => closeModal());
              }
            }}
            className="flex-1 px-4 py-2 bg-bab text-white rounded-lg hover:bg-bab-600 transition font-medium disabled:bg-babgray-300"
            disabled={selectedPlaceIdx === null}
          >
            선택
          </button>
        </div>
      </div>
      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          titleText={modal.title}
          contentText={modal.content}
          closeButtonText={modal.closeText}
          submitButtonText={modal.submitText}
          onSubmit={modal.onSubmit}
        />
      )}
    </div>
  );
};

export default MapSearchModal;
