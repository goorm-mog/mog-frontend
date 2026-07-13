import { createElement } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BusFront, Car, PersonStanding } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { loadKakaoMapSDK } from '@/services/kakaoMap';
import { colors } from '@/constants/colors';
import type { DepartureWithLabel, MidpointPlace } from '@/features/midpoint/types/midpoint';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

const TRANSPORT_ICON_MAP: Record<string, LucideIcon> = {
  PUBLIC: BusFront,
  CAR: Car,
  WALK: PersonStanding,
};

function getTransportIconHtml(type?: string): string {
  const Icon = (type && TRANSPORT_ICON_MAP[type]) ?? PersonStanding;
  return renderToStaticMarkup(createElement(Icon, { size: 14, color: 'white', strokeWidth: 2.5 }));
}


function createMidpointContent(): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText = 'cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));';
  el.innerHTML = `
    <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.716 23.284 0 15 0Z" fill="${colors.point}"/>
      <text x="15" y="20" font-size="13" text-anchor="middle" dominant-baseline="middle" fill="white">★</text>
    </svg>`;
  return el;
}

function createDepartureContent(label?: string, durationMinutes?: number, transportType?: string): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
  el.innerHTML = `
    <div style="background:rgba(255,255,255,0.95);border-radius:6px;padding:3px 8px;
                font-size:11px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.25);
                text-align:center;font-family:'Pretendard Variable',sans-serif;max-width:120px;overflow:hidden;text-overflow:ellipsis;">
      <div style="font-weight:600;color:${colors.text};overflow:hidden;text-overflow:ellipsis;">${label ?? '출발지'}</div>
      ${durationMinutes !== undefined ? `<div style="color:${colors.darkBorder};">${durationMinutes}분</div>` : ''}
    </div>
    <div style="position:relative;width:24px;height:34px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
      <svg width="24" height="34" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg"
           style="position:absolute;top:0;left:0;">
        <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 34 12 34C12 34 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="${colors.darkBorder}"/>
      </svg>
      <div style="position:absolute;top:5px;left:5px;width:14px;height:14px;
                  display:flex;align-items:center;justify-content:center;">
        ${getTransportIconHtml(transportType)}
      </div>
    </div>`;
  return el;
}

export function useMidpointMapSetup(
  mapRef: React.RefObject<HTMLDivElement | null>,
  places: MidpointPlace[],
  selectedPlace: MidpointPlace | null,
  departures: DepartureWithLabel[],
  onMarkerClick: (place: MidpointPlace) => void,
) {
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const mapInitializedRef = useRef(false);
  const midpointOverlaysRef = useRef<{ overlay: KakaoCustomOverlay; place: MidpointPlace }[]>([]);
  const departureOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapInitializedRef.current) return;
    mapInitializedRef.current = true;

    loadKakaoMapSDK().then(() => {
      if (!mapRef.current) return;
      const center = new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
      const map = new window.kakao.maps.Map(mapRef.current, { center, level: 7 });
      mapInstanceRef.current = map;
      setMapReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 중간지점 오버레이 동기화
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    midpointOverlaysRef.current.forEach(({ overlay }) => overlay.setMap(null));
    midpointOverlaysRef.current = [];

    const visiblePlaces = selectedPlace ? [selectedPlace] : places;
    const map = mapInstanceRef.current;
    const clickHandlers: Array<{ el: HTMLElement; fn: () => void }> = [];

    visiblePlaces.forEach((place) => {
      const pos = new window.kakao.maps.LatLng(place.latitude, place.longitude);
      const content = createMidpointContent();
      const overlay = new window.kakao.maps.CustomOverlay({
        content,
        position: pos,
        yAnchor: 1,
        zIndex: 3,
      }) as KakaoCustomOverlay;
      overlay.setMap(map);
      const handleClick = () => onMarkerClick(place);
      content.addEventListener('click', handleClick);
      clickHandlers.push({ el: content, fn: handleClick });
      midpointOverlaysRef.current.push({ overlay, place });
    });

    if (selectedPlace) {
      map.setCenter(new window.kakao.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude));
    } else {
      const bounds = new window.kakao.maps.LatLngBounds();
      visiblePlaces.forEach((p) => bounds.extend(new window.kakao.maps.LatLng(p.latitude, p.longitude)));
      departures.forEach((d) => bounds.extend(new window.kakao.maps.LatLng(d.latitude, d.longitude)));
      if (visiblePlaces.length > 0 || departures.length > 0) {
        map.setBounds(bounds, 60, 60, 120, 60);
      }
    }

    return () => {
      clickHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      midpointOverlaysRef.current.forEach(({ overlay }) => overlay.setMap(null));
      midpointOverlaysRef.current = [];
    };
  }, [mapReady, places, selectedPlace, departures, onMarkerClick]);

  // 출발지 오버레이 동기화
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    departureOverlaysRef.current.forEach((o) => o.setMap(null));
    departureOverlaysRef.current = [];

    departures.forEach(({ latitude, longitude, nickname, placeName, address, durationMinutes, transportType }) => {
      const pos = new window.kakao.maps.LatLng(latitude, longitude);
      const label = nickname ?? placeName ?? address;
      const content = createDepartureContent(label, durationMinutes, transportType);
      const overlay = new window.kakao.maps.CustomOverlay({
        content,
        position: pos,
        yAnchor: 1,
        zIndex: 2,
      }) as KakaoCustomOverlay;
      overlay.setMap(mapInstanceRef.current);
      departureOverlaysRef.current.push(overlay);
    });
  }, [mapReady, departures]);

  const handleZoomIn = useCallback(() => {
    const map = mapInstanceRef.current as KakaoMap;
    map?.setLevel(map.getLevel() - 1);
  }, []);

  const handleZoomOut = useCallback(() => {
    const map = mapInstanceRef.current as KakaoMap;
    map?.setLevel(map.getLevel() + 1);
  }, []);

  return { mapReady, handleZoomIn, handleZoomOut };
}
