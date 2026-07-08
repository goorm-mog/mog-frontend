import type { TransportType } from '@/features/departure/types/departure';

export interface DepartureDbItem {
  departureId: number;
  roomId: number;
  userId: number;
  nickname: string;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  transportType: TransportType;
}

export const departuresDb: DepartureDbItem[] = [
  {
    departureId: 1,
    roomId: 45,
    userId: 1,
    nickname: '김구름',
    placeName: '강남역',
    address: '서울 강남구 강남대로 396',
    latitude: 37.498095,
    longitude: 127.02761,
    transportType: 'PUBLIC',
  },
  {
    departureId: 2,
    roomId: 45,
    userId: 2,
    nickname: '박구름',
    placeName: '홍대입구역',
    address: '서울 마포구 양화로 160',
    latitude: 37.557527,
    longitude: 126.925595,
    transportType: 'PUBLIC',
  },
  {
    departureId: 3,
    roomId: 47,
    userId: 1,
    nickname: '김구름',
    placeName: '신촌역',
    address: '서울 서대문구 신촌로 90',
    latitude: 37.555134,
    longitude: 126.936893,
    transportType: 'PUBLIC',
  },
  {
    departureId: 4,
    roomId: 47,
    userId: 4,
    nickname: '이구름',
    placeName: '여의나루역',
    address: '서울 영등포구 여의동로 343',
    latitude: 37.527098,
    longitude: 126.932901,
    transportType: 'WALK',
  },
  {
    departureId: 5,
    roomId: 60,
    userId: 5,
    nickname: '정바다',
    placeName: '성수역',
    address: '서울 성동구 아차산로 100',
    latitude: 37.544581,
    longitude: 127.055961,
    transportType: 'PUBLIC',
  },
  {
    departureId: 6,
    roomId: 60,
    userId: 6,
    nickname: '한별',
    placeName: '뚝섬역',
    address: '서울 성동구 아차산로 18',
    latitude: 37.547184,
    longitude: 127.047367,
    transportType: 'WALK',
  },
  {
    departureId: 7,
    roomId: 70,
    userId: 1,
    nickname: '김구름',
    placeName: '서울역',
    address: '서울 중구 한강대로 405',
    latitude: 37.554678,
    longitude: 126.970606,
    transportType: 'CAR',
  },
  {
    departureId: 8,
    roomId: 80,
    userId: 3,
    nickname: '최구름',
    placeName: '충무로역',
    address: '서울 중구 퇴계로 199',
    latitude: 37.561243,
    longitude: 126.99428,
    transportType: 'PUBLIC',
  },
];
