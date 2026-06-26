import { useState, type KeyboardEvent } from 'react';
import type { PlaceSearchResult } from '@/pages/MeetRecord/types';
import { filterPlaces } from '@/pages/MeetRecord/utils/placeSearch';

export function usePlaceSearch() {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<PlaceSearchResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchPlaces = () => {
    setPlaces(filterPlaces(query));
    setIsDropdownOpen(true);
  };

  const selectPlace = (placeName: string) => {
    setQuery(placeName);
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
    setQuery,
    searchPlaces,
    selectPlace,
    handleKeyDown,
  };
}
