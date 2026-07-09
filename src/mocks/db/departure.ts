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
  // {
  //   departureId: 1,
  //   roomId: 45,
  //   userId: 1,
  //   nickname: '김구름',
  //   placeName: '강남역',
  //   address: '서울 강남구 강남대로 396',
  //   latitude: 37.498095,
  //   longitude: 127.02761,
  //   transportType: 'PUBLIC',
  // },
  {
    departureId: 1,
    roomId: 45,
    userId: 2,
    nickname: '박구름',
    placeName: '홍대입구역',
    address: '서울 마포구 양화로 160',
    latitude: 37.557527,
    longitude: 126.925595,
    transportType: 'PUBLIC',
  },
];
