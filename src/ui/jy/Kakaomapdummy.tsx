import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import type { Place } from '../../types/place';

interface KkoMapProps {
  radius?: number;
  onFetched?: (places: Place[]) => void;
}
// 헤더 쪽에 유틸 추가 (컴포넌트 위)
const toRad = (d: number) => (d * Math.PI) / 180;
const haversine = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const BEST_ACCURACY = 20; // m 이하이면 “꽤 정확”
const IMPROVE_THRESH = 30; // m 이상 좋아지면 교체
const REFINE_WINDOW_MS = 7000; // 보정 수집 시간

const DEFAULT_CENTER = { lat: 35.87058104715006, lng: 128.60503833459654 };

const KkoMapDetail = ({ radius = 1000, onFetched }: KkoMapProps) => {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const paginationRef = useRef<any | null>(null);
  const appendingRef = useRef(false); // append 여부 플래그
  const [hasMore, setHasMore] = useState(true);
  // 현재 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    let watchId: number | null = null;
    let bestSample: { lat: number; lng: number; acc: number } | null = null;
    let stopped = false;

    // 1) 빠른 초기 위치
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        const first = { lat: latitude, lng: longitude, acc: accuracy ?? 9999 };
        setCenter({ lat: first.lat, lng: first.lng });
        setLoading(false);
        bestSample = first;

        // 2) 정밀 보정(일정 시간 동안 더 정확한 샘플 수집)
        watchId = navigator.geolocation.watchPosition(
          p => {
            if (stopped) return;
            const cand = {
              lat: p.coords.latitude,
              lng: p.coords.longitude,
              acc: p.coords.accuracy ?? 9999,
            };

            // 명백히 튀는 샘플(초기 위치에서 너무 멀면) 제거: 1km 이상 점프 시 무시
            if (
              haversine(
                { lat: bestSample!.lat, lng: bestSample!.lng },
                { lat: cand.lat, lng: cand.lng },
              ) > 1000
            ) {
              return;
            }

            // 정확도가 좋아졌거나(작아짐), 같은 정확도면 거리 개선폭이 큰 경우 교체
            const improvedAccuracy = cand.acc < bestSample!.acc;
            const distGain = haversine(
              { lat: bestSample!.lat, lng: bestSample!.lng },
              { lat: cand.lat, lng: cand.lng },
            );

            if (
              improvedAccuracy ||
              (Math.abs(cand.acc - bestSample!.acc) < 1 && distGain > IMPROVE_THRESH)
            ) {
              bestSample = cand;
            }
          },
          // 에러는 초기 렌더가 이미 끝났으니 무시
          () => {},
          {
            enableHighAccuracy: true, // 고정밀 센서 사용
            timeout: 15000, // 개별 샘플 제한
            maximumAge: 0, // 캐시 금지
          },
        );

        // 보정 수집 윈도우 마감
        setTimeout(() => {
          if (stopped || !bestSample) return;
          const prev = { lat: first.lat, lng: first.lng };
          const next = { lat: bestSample.lat, lng: bestSample.lng };
          const dist = haversine(prev, next);

          // 이전 center 대비 의미 있는 개선이면 갱신
          if (bestSample.acc <= BEST_ACCURACY || dist > IMPROVE_THRESH) {
            setCenter(next);
            // 지도도 살짝 센터 이동
            mapRef.current?.setCenter(new window.kakao.maps.LatLng(next.lat, next.lng));
          }

          if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
          }
        }, REFINE_WINDOW_MS);
      },
      // 초기 getCurrentPosition 실패 → 기본 좌표로 진행
      () => {
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      },
    );

    // 클린업
    return () => {
      stopped = true;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const loadMore = () => {
    if (!hasMore || !paginationRef.current) return;
    appendingRef.current = true; // 다음 응답은 append로 처리
    paginationRef.current.nextPage(); // 카카오 SDK가 다음 페이지를 불러오고,
    // 불러오면 위 categorySearch 콜백이 다시 실행됩니다.
  };
  // 3) 지도 생성 시 ref 보관
  const handleOnCreate = (map: kakao.maps.Map) => {
    mapRef.current = map;
  };

  // 선택된 장소
  const selected = useMemo(
    () => places.find(p => p.id === selectedId) || null,
    [places, selectedId],
  );
  useEffect(() => {
    // 새 중심으로 검색 시작할 때 리스트와 페이지네이션 초기화
    setPlaces([]);
    setHasMore(true);
    paginationRef.current = null;
  }, [center]);

  // 마커 클릭 시 오버레이 + 지도 중심 이동(살짝)
  const handleMarkerClick = (p: Place) => {
    setSelectedId(p.id);
    mapRef.current?.setCenter(new window.kakao.maps.LatLng(p.lat, p.lng));
  };

  if (loading) {
    return <div className="py-10 text-center text-babgray-600">내 위치를 확인 중입니다...</div>;
  }

  return (
    <div className="flex justify-between">
      {/* 지도 영역 */}
      <div className=" w-full max-h-[356px] rounded-2xl overflow-hidden">
        <Map
          center={center}
          level={1}
          // className="h-full w-full"
          style={{ height: '356px' }}
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
    </div>
  );
};

export default KkoMapDetail;
