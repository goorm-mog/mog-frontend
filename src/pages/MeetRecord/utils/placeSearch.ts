import { meetingRecordsDb } from '@/mocks/db';
import type { PlaceSearchResult } from '@/pages/MeetRecord/types';

export const placeSearchResults: PlaceSearchResult[] = meetingRecordsDb.map(
  ({ recordId, placeName, address }) => ({
    id: String(recordId),
    name: placeName,
    address,
  }),
);

export function filterPlaces(keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return placeSearchResults;
  }

  return placeSearchResults.filter(
    ({ name, address }) =>
      name.toLowerCase().includes(normalizedKeyword) ||
      address.toLowerCase().includes(normalizedKeyword),
  );
}
