export const departuresDb = [
  {
    departureId: 3,
    roomId: 45,
    userId: 2,
    nickname: '박구름',
    placeName: '강남역',
    address: '서울 강남구 강남대로 396',
    latitude: 37.4979,
    longitude: 127.0276,
    transportType: 'PUBLIC',
    createdAt: '2026-06-18T10:00:00',
  },
  {
    departureId: 4,
    roomId: 45,
    userId: 3,
    nickname: '최구름',
    placeName: '선릉역',
    address: '서울 강남구 테헤란로 211',
    latitude: 37.5047,
    longitude: 127.0498,
    transportType: 'CAR',
    createdAt: '2026-06-18T10:10:00',
  },
  {
    departureId: 5,
    roomId: 45,
    userId: 4,
    nickname: '이구름',
    placeName: '역삼역',
    address: '서울 강남구 테헤란로 156',
    latitude: 37.5007,
    longitude: 127.0365,
    transportType: 'WALK',
    createdAt: '2026-06-18T10:20:00',
  },
] as const;

export const middlePointsDb = [
  {
    middlePointId: 1,
    roomId: 45,
    latitude: 37.5012,
    longitude: 127.0386,
    calculatedAt: '2026-06-18T10:05:00',
    travelTimes: [
      { userId: 2, nickname: '박구름', durationMinutes: 23, transportType: 'PUBLIC' },
      { userId: 3, nickname: '최구름', durationMinutes: 18, transportType: 'CAR' },
      { userId: 4, nickname: '이구름', durationMinutes: 11, transportType: 'WALK' },
    ],
  },
] as const;

export const recommendedPlacesDb = [
  {
    kakaoPlaceId: '12345678',
    placeName: '스시조',
    category: 'FD6',
    address: '서울 강남구 테헤란로 231',
    latitude: 37.5015,
    longitude: 127.039,
    distance: 45,
  },
  {
    kakaoPlaceId: '87654321',
    placeName: '테라로사 포스코센터점',
    category: 'CE7',
    address: '서울 강남구 테헤란로 440',
    latitude: 37.5058,
    longitude: 127.0531,
    distance: 420,
  },
  {
    kakaoPlaceId: '24681357',
    placeName: '선릉과 정릉',
    category: 'AT4',
    address: '서울 강남구 선릉로100길 1',
    latitude: 37.5082,
    longitude: 127.0479,
    distance: 830,
  },
] as const;

export const confirmedPlacesDb = [
  {
    confirmedPlaceId: 1,
    roomId: 45,
    kakaoPlaceId: '12345678',
    placeName: '스시조',
    address: '서울 강남구 테헤란로 231',
    category: 'FD6',
    latitude: 37.5015,
    longitude: 127.039,
    confirmedAt: '2026-06-18T10:10:00',
  },
] as const;
