let loadPromise: Promise<void> | null = null;

export function loadKakaoMapSDK(): Promise<void> {
  if (window.kakao?.maps) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.onload = () => window.kakao.maps.load(resolve);
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('카카오 지도 SDK 로드 실패'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
