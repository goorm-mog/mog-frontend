import { useEffect, useRef, useState } from 'react';
import { useKakaoPlaceSearch } from '@/hooks/useKakaoPlaceSearch';
import { useKakaoMapSetup } from '@/features/departure/hooks/useKakaoMapSetup';
import { useToast } from '@/hooks/useToast';
import type { SelectedPlace, TransportType } from '@/features/departure/types/departure';

const TRANSPORT_OPTIONS: { label: string; value: TransportType }[] = [
  { label: '대중교통', value: 'PUBLIC' },
  { label: '자동차', value: 'CAR' },
  { label: '도보', value: 'WALK' },
];

interface DepartureMapSectionProps {
  selectedPlace: SelectedPlace | null;
  onPlaceSelect: (place: SelectedPlace) => void;
  transport: TransportType | null;
  onTransportChange: (t: TransportType) => void;
  className?: string;
}

export default function DepartureMapSection({
  selectedPlace,
  onPlaceSelect,
  transport,
  onTransportChange,
  className,
}: DepartureMapSectionProps) {
  const { showToast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(selectedPlace?.placeName ?? '');
  const [prevSelectedPlace, setPrevSelectedPlace] = useState(selectedPlace);

  if (prevSelectedPlace !== selectedPlace) {
    setPrevSelectedPlace(selectedPlace);
    setQuery(selectedPlace ? selectedPlace.placeName : '');
  }
  const { search, results, isSearching, clear } = useKakaoPlaceSearch();

  // 지도 클릭 핸들러에서 호출할 콜백 — onPlaceSelect + 로컬 상태 업데이트를 묶음
  const applyPlaceRef = useRef<(place: SelectedPlace) => void>(() => {});
  useEffect(() => {
    applyPlaceRef.current = (place: SelectedPlace) => {
      onPlaceSelect(place);
      setQuery(place.placeName);
      clear();
    };
  });

  const { mapInstanceRef, markerRef, mapReady } = useKakaoMapSetup(mapRef, applyPlaceRef);

  // selectedPlace → 마커 + 지도 중심 이동
  useEffect(() => {
    if (!mapReady) return;

    if (markerRef.current) markerRef.current.setMap(null);

    if (selectedPlace) {
      const position = new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude);
      markerRef.current = new window.kakao.maps.Marker({ position });
      markerRef.current.setMap(mapInstanceRef.current);
      (mapInstanceRef.current as KakaoMap).setCenter(position);
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const pos = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
          (mapInstanceRef.current as KakaoMap).setCenter(pos);
        },
        () => { console.warn('지도 중심 이동을 위한 위치 정보를 가져올 수 없습니다.'); },
      );
    }
    // mapInstanceRef, markerRef는 useRef로 생성된 안정적인 참조값이므로 deps 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlace, mapReady]);

  const handleZoomIn = () => {
    const map = mapInstanceRef.current as KakaoMap;
    map.setLevel(map.getLevel() - 1);
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current as KakaoMap;
    map.setLevel(map.getLevel() + 1);
  };

  const handlePlaceSelect = (result: KakaoPlaceResult) => {
    const place: SelectedPlace = {
      placeName: result.place_name,
      address: result.road_address_name || result.address_name,
      latitude: Number(result.y),
      longitude: Number(result.x),
    };
    onPlaceSelect(place);
    setQuery(result.place_name);
    clear();
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = new window.kakao.maps.LatLng(coords.latitude, coords.longitude);
        (mapInstanceRef.current as KakaoMap).setCenter(position);

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(coords.longitude, coords.latitude, (result, status) => {
          const address =
            status === window.kakao.maps.services.Status.OK && result[0]
              ? result[0].road_address?.address_name || result[0].address.address_name
              : '';
          onPlaceSelect({
            placeName: '현재 위치',
            address,
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          setQuery('현재 위치');
          clear();
        });
      },
      () => showToast('현재 위치를 가져올 수 없습니다.'),
    );
  };

  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      <div className="relative h-[55vh] min-h-75">
        {/* 검색창 + 드롭다운 오버레이 */}
        <div className="absolute inset-3 z-10 flex flex-col pointer-events-none">
          <div className="flex items-center border border-dark-border bg-background rounded-md shadow px-4 py-3 gap-2 pointer-events-auto">
            <span className="text-dark-border">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search(query)}
              placeholder="장소를 검색하세요"
              className="flex-1 text-sm outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  clear();
                }}
                className="text-dark-border"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>

          {(results.length > 0 || isSearching) && (
            <ul className="mt-1 bg-background rounded-md shadow flex-1 overflow-y-auto scrollbar-none pointer-events-auto">
              {isSearching ? (
                <li className="px-4 py-3 text-sm text-dark-border">검색 중...</li>
              ) : (
                results.map((result) => (
                  <li
                    key={result.place_name + result.x}
                    className="px-4 py-3 text-sm cursor-pointer hover:bg-dark-background/70 border-b last:border-b-0 border-border"
                    onClick={() => handlePlaceSelect(result)}
                  >
                    <p className="font-medium text-text">{result.place_name}</p>
                    <p className="text-xs text-dark-border mt-0.5">
                      {result.road_address_name || result.address_name}
                    </p>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* 현재 위치 버튼 — 좌하단 */}
        <button
          onClick={handleCurrentLocation}
          className="absolute bottom-5 left-4 z-10 w-10 h-10 rounded-full bg-background shadow-md flex items-center justify-center"
          title="현재 위치"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </button>

        {/* 줌 컨트롤 — 우하단 */}
        <div className="absolute bottom-3 right-4 z-10 flex flex-col rounded-md shadow overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-background flex items-center justify-center text-xl font-light text-text border-b border-border"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-background flex items-center justify-center text-xl font-light text-text"
          >
            −
          </button>
        </div>

        <div ref={mapRef} className="w-full h-full" />
      </div>

      <div className="flex gap-2 px-4 py-4">
        {TRANSPORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTransportChange(opt.value)}
            className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
              transport === opt.value
                ? 'bg-point text-background border-point'
                : 'bg-background text-text border-dark-border'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
