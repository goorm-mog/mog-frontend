import type {
  MeetingRecord,
  RecordParticipant,
  RecordPayer,
  RoomRecordPhoto,
} from '@/types/records';

export type MockRoomRecordPhoto = RoomRecordPhoto & {
  roomId: number;
};

export type MockMeetingRecord = {
  roomId: number;
  recordId: number;
  seq: number;
  placeName: string;
  address: string;
  memo: string;
  totalCost: number;
  totalPrice: number;
  menuItems: { menuName: string; count: number; price: number }[];
  payer: RecordPayer | null;
  participants: RecordParticipant[];
  photoCount: number;
  createdAt: string;
};

export const meetingRecordPhotosDb: MockRoomRecordPhoto[] = [
  {
    photoId: 1,
    roomId: 45,
    s3Url: 'https://picsum.photos/seed/mog-room-45-1/360/504',
    createdAt: '2026-07-08T19:10:00.000Z',
  },
  {
    photoId: 2,
    roomId: 45,
    s3Url: 'https://picsum.photos/seed/mog-room-45-2/360/504',
    createdAt: '2026-07-08T20:20:00.000Z',
  },
  {
    photoId: 3,
    roomId: 45,
    s3Url: 'https://picsum.photos/seed/mog-room-45-3/360/504',
    createdAt: '2026-07-08T21:30:00.000Z',
  },
  {
    photoId: 4,
    roomId: 46,
    s3Url: 'https://picsum.photos/seed/mog-room-46-1/360/504',
    createdAt: '2026-07-03T14:40:00.000Z',
  },
  {
    photoId: 5,
    roomId: 60,
    s3Url: 'https://picsum.photos/seed/mog-room-60-1/360/504',
    createdAt: '2026-07-20T12:10:00.000Z',
  },
  {
    photoId: 6,
    roomId: 61,
    s3Url: 'https://picsum.photos/seed/mog-room-61-1/360/504',
    createdAt: '2026-06-30T19:50:00.000Z',
  },
  {
    photoId: 7,
    roomId: 70,
    s3Url: 'https://picsum.photos/seed/mog-room-70-1/360/504',
    createdAt: '2026-07-10T12:30:00.000Z',
  },
  {
    photoId: 8,
    roomId: 70,
    s3Url: 'https://picsum.photos/seed/mog-room-70-2/360/504',
    createdAt: '2026-07-10T18:20:00.000Z',
  },
  {
    photoId: 9,
    roomId: 70,
    s3Url: 'https://picsum.photos/seed/mog-room-70-3/360/504',
    createdAt: '2026-07-11T10:15:00.000Z',
  },
];

export const meetingRecordsDb: MockMeetingRecord[] = [
  {
    roomId: 45,
    recordId: 1,
    seq: 1,
    placeName: '팔색삼겹살 강남점',
    address: '서울 강남구 강남대로96길 11',
    memo: '예약석에서 바로 식사 시작',
    totalCost: 72000,
    totalPrice: 72000,
    menuItems: [
      { menuName: '팔색삼겹살 세트', count: 2, price: 56000 },
      { menuName: '볶음밥', count: 2, price: 8000 },
      { menuName: '음료', count: 4, price: 8000 },
    ],
    payer: {
      roomMemberId: 101,
      nickname: '김구름',
      bankName: '신한은행',
      accountNumber: '110-1234-1234',
    },
    participants: [
      { roomMemberId: 101, nickname: '김구름', amount: 18000 },
      { roomMemberId: 102, nickname: '박구름', amount: 18000 },
      { roomMemberId: 103, nickname: '최구름', amount: 18000 },
      { roomMemberId: 104, nickname: '이구름', amount: 18000 },
    ],
    photoCount: 2,
    createdAt: '2026-07-08T19:30:00.000Z',
  },
  {
    roomId: 45,
    recordId: 2,
    seq: 2,
    placeName: '카페 노티드 강남',
    address: '서울 강남구 테헤란로1길 28',
    memo: '도넛은 포장해서 나눠감',
    totalCost: 32000,
    totalPrice: 32000,
    menuItems: [
      { menuName: '아메리카노', count: 3, price: 15000 },
      { menuName: '우유생크림 도넛', count: 4, price: 14000 },
      { menuName: '얼그레이 티', count: 1, price: 3000 },
    ],
    payer: {
      roomMemberId: 102,
      nickname: '박구름',
      bankName: '국민은행',
      accountNumber: '004-21-098765',
    },
    participants: [
      { roomMemberId: 101, nickname: '김구름', amount: 12000 },
      { roomMemberId: 102, nickname: '박구름', amount: 10000 },
      { roomMemberId: 104, nickname: '이구름', amount: 10000 },
    ],
    photoCount: 1,
    createdAt: '2026-07-08T21:00:00.000Z',
  },
  {
    roomId: 45,
    recordId: 3,
    seq: 3,
    placeName: '인생네컷 강남역점',
    address: '서울 강남구 강남대로102길 14',
    memo: '사진 두 장씩 가져감',
    totalCost: 24000,
    totalPrice: 24000,
    menuItems: [{ menuName: '프레임 촬영', count: 3, price: 24000 }],
    payer: {
      roomMemberId: 104,
      nickname: '이구름',
      bankName: '토스뱅크',
      accountNumber: '1000-9988-7766',
    },
    participants: [
      { roomMemberId: 101, nickname: '김구름', amount: 8000 },
      { roomMemberId: 103, nickname: '최구름', amount: 8000 },
      { roomMemberId: 104, nickname: '이구름', amount: 8000 },
    ],
    photoCount: 0,
    createdAt: '2026-07-08T22:10:00.000Z',
  },
  {
    roomId: 46,
    recordId: 4,
    seq: 1,
    placeName: '홍대 보드게임 카페 레드버튼',
    address: '서울 마포구 홍익로 10',
    memo: '3시간 이용',
    totalCost: 27000,
    totalPrice: 27000,
    menuItems: [{ menuName: '보드게임 이용권', count: 3, price: 27000 }],
    payer: {
      roomMemberId: 202,
      nickname: '박구름',
      bankName: '국민은행',
      accountNumber: '004-21-098765',
    },
    participants: [
      { roomMemberId: 201, nickname: '김구름', amount: 9000 },
      { roomMemberId: 202, nickname: '박구름', amount: 9000 },
      { roomMemberId: 203, nickname: '최구름', amount: 9000 },
    ],
    photoCount: 1,
    createdAt: '2026-07-03T16:20:00.000Z',
  },
  {
    roomId: 46,
    recordId: 5,
    seq: 2,
    placeName: '홍대 분식 연구소',
    address: '서울 마포구 와우산로 23',
    memo: '간단히 먹고 해산',
    totalCost: 18000,
    totalPrice: 18000,
    menuItems: [
      { menuName: '떡볶이', count: 1, price: 7000 },
      { menuName: '튀김 세트', count: 1, price: 6000 },
      { menuName: '음료', count: 2, price: 5000 },
    ],
    payer: {
      roomMemberId: 203,
      nickname: '최구름',
      bankName: '카카오뱅크',
      accountNumber: '3333-1234-5678',
    },
    participants: [
      { roomMemberId: 201, nickname: '김구름', amount: 9000 },
      { roomMemberId: 203, nickname: '최구름', amount: 9000 },
    ],
    photoCount: 0,
    createdAt: '2026-07-03T17:30:00.000Z',
  },
  {
    roomId: 60,
    recordId: 6,
    seq: 1,
    placeName: '성수 세미나룸 A',
    address: '서울 성동구 연무장길 42',
    memo: '워크샵 공간 대여와 케이터링',
    totalCost: 65000,
    totalPrice: 65000,
    menuItems: [
      { menuName: '회의실 3시간', count: 1, price: 45000 },
      { menuName: '샌드위치 플래터', count: 1, price: 20000 },
    ],
    payer: {
      roomMemberId: 401,
      nickname: '정바다',
      bankName: '하나은행',
      accountNumber: '620-910123-456',
    },
    participants: [
      { roomMemberId: 401, nickname: '정바다', amount: 13000 },
      { roomMemberId: 402, nickname: '김구름', amount: 13000 },
      { roomMemberId: 403, nickname: '한별', amount: 13000 },
      { roomMemberId: 404, nickname: '윤초록', amount: 13000 },
      { roomMemberId: 405, nickname: '서민준', amount: 13000 },
    ],
    photoCount: 1,
    createdAt: '2026-07-20T12:00:00.000Z',
  },
  {
    roomId: 60,
    recordId: 7,
    seq: 2,
    placeName: '성수 블루보틀',
    address: '서울 성동구 아차산로 7',
    memo: '리뷰 정리하면서 커피',
    totalCost: 29000,
    totalPrice: 29000,
    menuItems: [
      { menuName: '라떼', count: 2, price: 12000 },
      { menuName: '아메리카노', count: 2, price: 10000 },
      { menuName: '쿠키', count: 2, price: 7000 },
    ],
    payer: {
      roomMemberId: 403,
      nickname: '한별',
      bankName: '우리은행',
      accountNumber: '1002-555-777777',
    },
    participants: [
      { roomMemberId: 401, nickname: '정바다', amount: 9000 },
      { roomMemberId: 403, nickname: '한별', amount: 10000 },
      { roomMemberId: 405, nickname: '서민준', amount: 10000 },
    ],
    photoCount: 0,
    createdAt: '2026-07-20T15:10:00.000Z',
  },
  {
    roomId: 61,
    recordId: 8,
    seq: 1,
    placeName: '을지로 와인바 낮달',
    address: '서울 중구 을지로12길 21',
    memo: '런칭 회고 겸 저녁',
    totalCost: 57000,
    totalPrice: 57000,
    menuItems: [
      { menuName: '하우스 와인', count: 3, price: 24000 },
      { menuName: '라자냐', count: 1, price: 18000 },
      { menuName: '감바스', count: 1, price: 15000 },
    ],
    payer: {
      roomMemberId: 501,
      nickname: '정바다',
      bankName: '하나은행',
      accountNumber: '620-910123-456',
    },
    participants: [
      { roomMemberId: 501, nickname: '정바다', amount: 19000 },
      { roomMemberId: 502, nickname: '한별', amount: 19000 },
      { roomMemberId: 503, nickname: '오하린', amount: 19000 },
    ],
    photoCount: 1,
    createdAt: '2026-06-30T20:20:00.000Z',
  },
  {
    roomId: 61,
    recordId: 9,
    seq: 2,
    placeName: '을지로 베이커리',
    address: '서울 중구 충무로 35',
    memo: '케이크 픽업',
    totalCost: 22000,
    totalPrice: 22000,
    menuItems: [{ menuName: '레몬 파운드 케이크', count: 1, price: 22000 }],
    payer: {
      roomMemberId: 503,
      nickname: '오하린',
      bankName: '케이뱅크',
      accountNumber: '100-987-654321',
    },
    participants: [
      { roomMemberId: 501, nickname: '정바다', amount: 8000 },
      { roomMemberId: 503, nickname: '오하린', amount: 14000 },
    ],
    photoCount: 0,
    createdAt: '2026-06-30T21:00:00.000Z',
  },
  {
    roomId: 70,
    recordId: 10,
    seq: 1,
    placeName: '강릉 경포대 펜션',
    address: '강원 강릉시 창해로 307',
    memo: '1박 숙박비 선결제',
    totalCost: 180000,
    totalPrice: 180000,
    menuItems: [{ menuName: '오션뷰 객실', count: 1, price: 180000 }],
    payer: {
      roomMemberId: 601,
      nickname: '김구름',
      bankName: '신한은행',
      accountNumber: '110-1234-1234',
    },
    participants: [
      { roomMemberId: 601, nickname: '김구름', amount: 45000 },
      { roomMemberId: 602, nickname: '서민준', amount: 45000 },
      { roomMemberId: 603, nickname: '오하린', amount: 45000 },
      { roomMemberId: 604, nickname: '강도윤', amount: 45000 },
    ],
    photoCount: 1,
    createdAt: '2026-07-10T11:30:00.000Z',
  },
  {
    roomId: 70,
    recordId: 11,
    seq: 2,
    placeName: '초당 순두부 마을',
    address: '강원 강릉시 초당순두부길 95',
    memo: '점심 식사',
    totalCost: 88000,
    totalPrice: 88000,
    menuItems: [
      { menuName: '짬뽕순두부', count: 3, price: 45000 },
      { menuName: '모두부', count: 1, price: 18000 },
      { menuName: '감자전', count: 1, price: 25000 },
    ],
    payer: {
      roomMemberId: 602,
      nickname: '서민준',
      bankName: '기업은행',
      accountNumber: '010-223344-56-789',
    },
    participants: [
      { roomMemberId: 601, nickname: '김구름', amount: 22000 },
      { roomMemberId: 602, nickname: '서민준', amount: 22000 },
      { roomMemberId: 603, nickname: '오하린', amount: 22000 },
      { roomMemberId: 604, nickname: '강도윤', amount: 22000 },
    ],
    photoCount: 1,
    createdAt: '2026-07-10T13:00:00.000Z',
  },
  {
    roomId: 70,
    recordId: 12,
    seq: 3,
    placeName: '안목해변 카페거리',
    address: '강원 강릉시 창해로14번길 20',
    memo: '커피와 디저트',
    totalCost: 52000,
    totalPrice: 52000,
    menuItems: [
      { menuName: '핸드드립', count: 2, price: 16000 },
      { menuName: '라떼', count: 2, price: 14000 },
      { menuName: '케이크', count: 2, price: 22000 },
    ],
    payer: {
      roomMemberId: 604,
      nickname: '강도윤',
      bankName: '부산은행',
      accountNumber: '112-2222-3333-44',
    },
    participants: [
      { roomMemberId: 601, nickname: '김구름', amount: 13000 },
      { roomMemberId: 602, nickname: '서민준', amount: 13000 },
      { roomMemberId: 603, nickname: '오하린', amount: 13000 },
      { roomMemberId: 604, nickname: '강도윤', amount: 13000 },
    ],
    photoCount: 1,
    createdAt: '2026-07-10T17:30:00.000Z',
  },
];

export const toMeetingRecordApiData = (record: MockMeetingRecord): MeetingRecord => ({
  recordId: record.recordId,
  seq: record.seq,
  placeName: record.placeName,
  memo: record.memo,
  totalCost: record.totalCost,
  payer: record.payer,
  participants: record.participants,
  createdAt: record.createdAt,
});

export const toRoomRecordPhotoApiData = ({
  photoId,
  s3Url,
  createdAt,
}: MockRoomRecordPhoto): RoomRecordPhoto => ({
  photoId,
  s3Url,
  createdAt,
});
