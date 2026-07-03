import { useState } from 'react';

export function useKakaoPlaceSearch() {
  const [results, setResults] = useState<KakaoPlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = (keyword: string) => {
    if (!keyword.trim()) return;
    setIsSearching(true);
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(keyword, (data, status) => {
      setResults(status === 'OK' ? data : []);
      setIsSearching(false);
    });
  };

  const clear = () => setResults([]);

  return { search, results, isSearching, clear };
}
