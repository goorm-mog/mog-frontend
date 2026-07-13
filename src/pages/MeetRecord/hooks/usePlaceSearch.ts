import { useState, type KeyboardEvent } from 'react';
import { loadKakaoMapSDK } from '@/services/kakaoMap';
import type { PlaceSearchResult } from '@/pages/MeetRecord/types';

const toPlaceSearchResult = (place: KakaoPlaceResult): PlaceSearchResult => ({
  id: place.id || `${place.place_name}-${place.x}-${place.y}`,
  name: place.place_name,
  address: place.road_address_name || place.address_name,
});

export function usePlaceSearch(initialPlaceName = '', initialPlaceAddress: string | null = null) {
  const [query, setQuery] = useState(initialPlaceName);
  const [places, setPlaces] = useState<PlaceSearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSelectedPlace, setHasSelectedPlace] = useState(Boolean(initialPlaceName));
  const [selectedAddress, setSelectedAddress] = useState(initialPlaceAddress);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setSelectedAddress(null);

    if (!nextQuery) {
      setHasSelectedPlace(false);
      setIsDropdownOpen(false);
    }
  };

  const searchPlaces = async () => {
    const keyword = query.trim();

    if (!keyword) {
      setPlaces([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    setIsDropdownOpen(true);

    try {
      await loadKakaoMapSDK();

      const placesService = new window.kakao.maps.services.Places();
      placesService.keywordSearch(keyword, (results, status) => {
        setPlaces(status === window.kakao.maps.services.Status.OK
          ? results.map(toPlaceSearchResult)
          : []);
        setIsSearching(false);
      });
    } catch {
      setPlaces([]);
      setErrorMessage('장소 검색을 불러올 수 없습니다');
      setIsSearching(false);
    }
  };

  const selectPlace = (place: PlaceSearchResult) => {
    setQuery(place.name);
    setSelectedAddress(place.address);
    setHasSelectedPlace(true);
    setIsDropdownOpen(false);
  };

  const editPlace = () => {
    setHasSelectedPlace(false);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchPlaces();
    }

    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return {
    query,
    places,
    isDropdownOpen,
    hasSelectedPlace,
    selectedAddress,
    isSearching,
    errorMessage,
    setQuery: changeQuery,
    searchPlaces,
    selectPlace,
    editPlace,
    handleKeyDown,
  };
}
