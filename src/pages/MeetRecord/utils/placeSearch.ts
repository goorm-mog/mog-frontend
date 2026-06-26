import type { PlaceSearchResult } from '@/pages/MeetRecord/types';

// 추후 없어질 부분
export const placeSearchResults: PlaceSearchResult[] = [
  { id: 1, name: '합정 카페 A', address: '서울 마포구 독막로 12' },
  { id: 2, name: '합정 카페거리', address: '서울 마포구 양화로6길 21' },
  { id: 3, name: '합정역 브런치 카페', address: '서울 마포구 월드컵로 5' },
  { id: 4, name: '냥냥 룰루', address: '서울 마포구 어울마당로 45' },
  { id: 5, name: '홍대입구 술집 B', address: '서울 마포구 잔다리로 18' },
  { id: 6, name: '상수 이자카야', address: '서울 마포구 와우산로 33' },
  { id: 7, name: '연남동 파스타', address: '서울 마포구 동교로 242' },
];

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
