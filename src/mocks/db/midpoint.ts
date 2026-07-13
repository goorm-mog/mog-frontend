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
      travelTimes: [
        { userId: 1, nickname: '김구름', durationMinutes: 22, transportType: 'PUBLIC' },
        { userId: 2, nickname: '박구름', durationMinutes: 34, transportType: 'CAR' },
      ],
    },
    {
      placeId: 2,
      placeName: '역삼역',
      address: '서울 강남구 역삼동 837-11',
      latitude: 37.5003,
      longitude: 127.0369,
      travelTimes: [
        { userId: 1, nickname: '김구름', durationMinutes: 15, transportType: 'PUBLIC' },
        { userId: 2, nickname: '박구름', durationMinutes: 42, transportType: 'CAR' },
      ],
    },
    {
      placeId: 3,
      placeName: '코엑스',
      address: '서울 강남구 삼성로 512',
      latitude: 37.5126,
      longitude: 127.0594,
      travelTimes: [
        { userId: 1, nickname: '김구름', durationMinutes: 31, transportType: 'PUBLIC' },
        { userId: 2, nickname: '박구름', durationMinutes: 25, transportType: 'CAR' },
      ],
    },
  ],
};
