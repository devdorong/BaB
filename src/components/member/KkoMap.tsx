import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Map, MapMarker, MarkerClusterer, CustomOverlayMap } from 'react-kakao-maps-sdk';
import type { Place } from '../../types/place';

interface KkoMapProps {
  radius?: number;
  onFetched?: (places: Place[]) => void;
}

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

const KkoMap = ({ radius = 1000, onFetched }: KkoMapProps) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      () => {
        // 권한 거부/실패 → 기본 좌표
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }, []);

  // 2) 맛집 검색 (카테고리 FD6) — center 변경 시 재검색
  const searchNearby = useCallback(
    (c: { lat: number; lng: number }) => {
      if (!window.kakao?.maps?.services) return;
      const ps = new window.kakao.maps.services.Places();

      const loc = new window.kakao.maps.LatLng(c.lat, c.lng);

      // categorySearch('FD6', ...) : 음식점
      ps.categorySearch(
        'FD6',
        (data: any[], status: string) => {
          if (status !== window.kakao.maps.services.Status.OK) {
            setPlaces([]);
            onFetched?.([]);
            return;
          }
          const mapped: Place[] = data.map((d: any) => ({
            id: d.id,
            name: d.place_name,
            lat: parseFloat(d.y),
            lng: parseFloat(d.x),
            address: d.address_name,
            roadAddress: d.road_address_name || undefined,
            phone: d.phone || undefined,
            url: d.place_url || undefined,
            distance: d.distance ? Number(d.distance) : undefined, // categorySearch는 distance 제공(옵션에 따라)
            category: d.category_name,
          }));
          setPlaces(mapped);
          onFetched?.(mapped);
        },
        {
          location: loc, // 기준 좌표
          radius, // m
          sort: window.kakao.maps.services.SortBy.DISTANCE, // 거리순
        },
      );
    },
    [onFetched, radius],
  );

  // center가 바뀌면 검색 실행 (초기/사용자 이동 등에 대응)
  useEffect(() => {
    searchNearby(center);
  }, [center, searchNearby]);

  // 3) 지도 생성 시 ref 보관
  const handleOnCreate = (map: kakao.maps.Map) => {
    mapRef.current = map;
  };

  // 선택된 장소
  const selected = useMemo(
    () => places.find(p => p.id === selectedId) || null,
    [places, selectedId],
  );

  // 마커 클릭 시 오버레이 + 지도 중심 이동(살짝)
  const handleMarkerClick = (p: Place) => {
    setSelectedId(p.id);
    mapRef.current?.setCenter(new window.kakao.maps.LatLng(p.lat, p.lng));
  };

  if (loading) {
    return <div className="py-10 text-center text-babgray-600">내 위치를 확인 중입니다...</div>;
  }

  return (
    <div className="grid grid-cols-[1fr_360px] gap-6 items-start">
      {/* 지도 영역 */}
      <div className="rounded-2xl overflow-hidden">
        <Map
          center={center}
          level={4}
          style={{ width: '100%', height: '420px' }}
          onCreate={handleOnCreate}
          onCenterChanged={map => {
            // 지도가 움직이면 center 업데이트 (드래그 기반 재검색을 원하면 주석 해제)
            // const c = map.getCenter();
            // setCenter({ lat: c.getLat(), lng: c.getLng() });
          }}
        >
          {/* 현재 위치 마커 */}
          <MapMarker
            position={center}
            image={{
              src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
              size: { width: 24, height: 35 },
            }}
          />

          {/* 맛집 마커 클러스터 */}
          <MarkerClusterer averageCenter minLevel={6}>
            {places.map(p => (
              <MapMarker
                key={p.id}
                position={{ lat: p.lat, lng: p.lng }}
                onClick={() => handleMarkerClick(p)}
              />
            ))}
          </MarkerClusterer>

          {/* 선택 오버레이 */}
          {selected && (
            <CustomOverlayMap position={{ lat: selected.lat, lng: selected.lng }} yAnchor={1.3}>
              <div className="bg-white rounded-xl shadow-lg p-3 min-w-[220px]">
                <div className="font-semibold text-sm">{selected.name}</div>
                <div className="text-xs text-babgray-600 mt-1">
                  {selected.roadAddress || selected.address}
                </div>
                {selected.distance !== undefined && (
                  <div className="text-xs text-babgray-500 mt-1">
                    약 {(selected.distance / 1000).toFixed(1)} km
                  </div>
                )}
                {selected.phone && <div className="text-xs mt-1">{selected.phone}</div>}
                <div className="mt-2 flex gap-2">
                  {selected.url && (
                    <a
                      className="text-xs px-2 py-1 rounded-lg bg-bab-500 text-white"
                      href={selected.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      상세보기
                    </a>
                  )}
                  <button
                    className="text-xs px-2 py-1 rounded-lg border"
                    onClick={() => setSelectedId(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </CustomOverlayMap>
          )}
        </Map>
      </div>

      {/* 우측 리스트 (간단 카드) */}
      <aside className="flex flex-col gap-3">
        <h3 className="text-lg font-bold mb-1">내 주변 맛집 추천</h3>
        {places.slice(0, 10).map(p => (
          <button
            key={p.id}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left hover:shadow-sm ${
              selectedId === p.id ? 'border-bab-500' : 'border-babgray-200'
            }`}
            onClick={() => handleMarkerClick(p)}
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-babgray-100">
              {/* 썸네일 준비되면 <img src={p.thumbnail} .../> 로 교체 */}
              <img src="/fallback_food.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-babgray-600 truncate">{p.roadAddress || p.address}</div>
              {p.distance !== undefined && (
                <div className="text-xs text-babgray-500 mt-0.5">
                  ⟂ {(p.distance / 1000).toFixed(1)} km
                </div>
              )}
            </div>
          </button>
        ))}
      </aside>
    </div>
  );
};

export default KkoMap;
