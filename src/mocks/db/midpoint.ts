import type { MidpointResult } from '@/features/midpoint/types/midpoint';

export const midpointDb: MidpointResult = {
  middlePointId: 1,
  roomId: 45,
  latitude: 37.5035,
  longitude: 127.0244,
  address: '서울 강남구 테헤란로 212',
  placeName: '테헤란로 212',
  calculatedAt: '2026-07-06T10:00:00Z',
  travelTimes: [
    { userId: 1, nickname: '김구름', durationMinutes: 24, transportType: 'PUBLIC' },
    { userId: 2, nickname: '박구름', durationMinutes: 32, transportType: 'CAR' },
  ],
  places: [
    {
      placeId: 1,
      placeName: '테헤란로',
      address: '서울 강남구 테헤란로 212',
      latitude: 37.5035,
      longitude: 127.0244,
    },
    {
      placeId: 2,
      placeName: '역삼역',
      address: '서울 강남구 역삼동 837-11',
      latitude: 37.4979,
      longitude: 127.0276,
    },
    {
      placeId: 3,
      placeName: '코엑스',
      address: '서울 강남구 삼성로 512',
      latitude: 37.5062,
      longitude: 127.0557,
    },
  ],
};
