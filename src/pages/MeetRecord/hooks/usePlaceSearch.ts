import { useState, type KeyboardEvent } from 'react';
import type { PlaceSearchResult } from '@/pages/MeetRecord/types';
import { filterPlaces } from '@/pages/MeetRecord/utils/placeSearch';

export function usePlaceSearch(initialPlaceName = '') {
  const [query, setQuery] = useState(initialPlaceName);
  const [places, setPlaces] = useState<PlaceSearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSelectedPlace, setHasSelectedPlace] = useState(Boolean(initialPlaceName));

  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery);

    if (!nextQuery) {
      setHasSelectedPlace(false);
      setIsDropdownOpen(false);
    }
  };

  const searchPlaces = () => {
    setPlaces(filterPlaces(query));
    setIsDropdownOpen(true);
  };

  const selectPlace = (placeName: string) => {
    setQuery(placeName);
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
    setQuery: changeQuery,
    searchPlaces,
    selectPlace,
    editPlace,
    handleKeyDown,
  };
}
