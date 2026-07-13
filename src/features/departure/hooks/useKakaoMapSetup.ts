import { useEffect, useRef, useState } from 'react';
import { loadKakaoMapSDK } from '@/services/kakaoMap';
import type { SelectedPlace } from '@/features/departure/types/departure';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
const POI_NEARBY_THRESHOLD_DEG = 0.0005; // 위·경도 약 55m 이내

export function useKakaoMapSetup(
  mapRef: React.RefObject<HTMLDivElement | null>,
  applyPlaceRef: React.MutableRefObject<(place: SelectedPlace) => void>,
) {
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const mapInitializedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapInitializedRef.current) return;
    mapInitializedRef.current = true;

    loadKakaoMapSDK().then(() => {
      if (!mapRef.current) return;

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
        level: 5,
      });
      mapInstanceRef.current = map;

      const geocoder = new window.kakao.maps.services.Geocoder();
      const placesService = new window.kakao.maps.services.Places();

      window.kakao.maps.event.addListener(map, 'click', (mouseEvent: unknown) => {
        const latLng = (mouseEvent as { latLng: KakaoLatLng }).latLng;
        const lat = latLng.getLat();
        const lng = latLng.getLng();
        const clickPos = new window.kakao.maps.LatLng(lat, lng);

        geocoder.coord2Address(lng, lat, (addressResult, addressStatus) => {
          if (addressStatus !== window.kakao.maps.services.Status.OK || !addressResult[0]) return;

          const addr = addressResult[0];
          const fallbackAddress = addr.road_address?.address_name || addr.address.address_name;
          const fallbackName = addr.road_address?.building_name || fallbackAddress;

          const apply = (placeName: string, address: string) => {
            applyPlaceRef.current({ placeName, address, latitude: lat, longitude: lng });
          };

          placesService.keywordSearch(
            fallbackAddress,
            (poiResults, poiStatus) => {
              if (poiStatus === window.kakao.maps.services.Status.OK && poiResults.length > 0) {
                const poi = poiResults[0];
                const isNearby =
                  Math.abs(Number(poi.y) - lat) < POI_NEARBY_THRESHOLD_DEG &&
                  Math.abs(Number(poi.x) - lng) < POI_NEARBY_THRESHOLD_DEG;
                if (isNearby) {
                  apply(poi.place_name, poi.road_address_name || poi.address_name);
                  return;
                }
              }
              apply(fallbackName, fallbackAddress);
            },
            { location: clickPos, radius: 50, sort: window.kakao.maps.services.SortBy.DISTANCE },
          );
        });
      });

      setMapReady(true);
    });
    // mapRef, applyPlaceRef는 useRef로 생성된 안정적인 참조값이므로 deps 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mapInstanceRef, markerRef, mapReady };
}
