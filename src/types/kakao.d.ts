declare global {
  interface KakaoMap {
    setCenter: (position: KakaoLatLng) => void;
    setLevel: (level: number) => void;
    getLevel: () => number;
    setBounds: (bounds: KakaoLatLngBounds, paddingTop?: number, paddingRight?: number, paddingBottom?: number, paddingLeft?: number) => void;
  }

  interface KakaoMarker {
    setMap: (map: KakaoMap | null) => void;
  }

  interface KakaoCustomOverlay {
    setMap: (map: KakaoMap | null) => void;
  }

  interface KakaoLatLngBounds {
    extend: (latlng: KakaoLatLng) => void;
  }

  interface KakaoPlaceResult {
    id: string;
    place_name: string;
    road_address_name: string;
    address_name: string;
    x: string;
    y: string;
  }

  interface KakaoAddressResult {
    road_address: {
      address_name: string;
      building_name: string;
    } | null;
    address: {
      address_name: string;
    };
  }

  interface KakaoLatLng {
    getLat: () => number;
    getLng: () => number;
  }

  interface Window {
    kakao: {
      maps: {
        load: (cb: () => void) => void;
        Map: new (el: HTMLElement, opts: { center: KakaoLatLng; level: number }) => KakaoMap;
        Marker: new (opts: { position: KakaoLatLng }) => KakaoMarker;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        CustomOverlay: new (opts: { content: HTMLElement; position: KakaoLatLng; yAnchor?: number; zIndex?: number }) => KakaoCustomOverlay;
        LatLngBounds: new () => KakaoLatLngBounds;
        ZoomControl: new () => unknown;
        ControlPosition: {
          RIGHT: unknown;
          BOTTOMRIGHT: unknown;
          BOTTOM: unknown;
        };
        event: {
          addListener: (target: unknown, type: string, handler: (e: unknown) => void) => void;
        };
        services: {
          Places: new () => {
            keywordSearch: (
              keyword: string,
              callback: (result: KakaoPlaceResult[], status: string) => void,
              options?: { location?: unknown; radius?: number; sort?: string },
            ) => void;
          };
          Geocoder: new () => {
            coord2Address: (
              lng: number,
              lat: number,
              callback: (result: KakaoAddressResult[], status: string) => void,
            ) => void;
          };
          Status: { OK: string };
          SortBy: { ACCURACY: string; DISTANCE: string };
        };
      };
    };
  }
}

export {};
