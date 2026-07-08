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
    placeName: '김구름 집',
    address: '서울시 송파구 올림픽로 300',
    latitude: 37.513261,
    longitude: 127.100134,
    transportType: 'PUBLIC',
  },
  {
    departureId: 2,
    roomId: 45,
    userId: 2,
    nickname: '박구름',
    placeName: '박구름 회사',
    address: '서울시 마포구 월드컵북로 396',
    latitude: 37.579617,
    longitude: 126.88986,
    transportType: 'PUBLIC',
  },
  {
    departureId: 3,
    roomId: 47,
    userId: 1,
    nickname: '김구름',
    placeName: '김구름 집',
    address: '서울시 송파구 올림픽로 300',
    latitude: 37.513261,
    longitude: 127.100134,
    transportType: 'PUBLIC',
  },
  {
    departureId: 4,
    roomId: 47,
    userId: 4,
    nickname: '이구름',
    placeName: '이구름 집',
    address: '서울시 영등포구 국제금융로 10',
    latitude: 37.525872,
    longitude: 126.924606,
    transportType: 'WALK',
  },
  {
    departureId: 5,
    roomId: 60,
    userId: 5,
    nickname: '정바다',
    placeName: '정바다 회사',
    address: '서울시 강남구 테헤란로 427',
    latitude: 37.505713,
    longitude: 127.049058,
    transportType: 'PUBLIC',
  },
  {
    departureId: 6,
    roomId: 60,
    userId: 6,
    nickname: '한별',
    placeName: '한별 작업실',
    address: '서울시 성동구 왕십리로 83',
    latitude: 37.54465,
    longitude: 127.044512,
    transportType: 'WALK',
  },
  {
    departureId: 7,
    roomId: 70,
    userId: 1,
    nickname: '김구름',
    placeName: '서울역 렌터카 승차장',
    address: '서울시 용산구 한강대로 405',
    latitude: 37.554678,
    longitude: 126.970606,
    transportType: 'CAR',
  },
  {
    departureId: 8,
    roomId: 80,
    userId: 3,
    nickname: '최구름',
    placeName: '최구름 집',
    address: '서울시 중구 퇴계로 199',
    latitude: 37.561243,
    longitude: 126.99428,
    transportType: 'PUBLIC',
  },
];
