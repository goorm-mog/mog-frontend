export const meetingPhotosDb = [
  {
    photoId: 1,
    roomId: 45,
    s3Url: 'https://s3.amazonaws.com/mog/photos/room/45/photo1.jpg',
    createdAt: '2026-06-20T22:00:00',
  },
  {
    photoId: 2,
    roomId: 45,
    s3Url: 'https://s3.amazonaws.com/mog/photos/room/45/photo2.jpg',
    createdAt: '2026-06-20T22:05:00',
  },
  {
    photoId: 3,
    roomId: 45,
    s3Url: 'https://s3.amazonaws.com/mog/photos/room/45/photo3.jpg',
    createdAt: '2026-06-20T22:10:00',
  },
] as const;

export const meetingRecordsDb = [
  {
    recordId: 1,
    roomId: 45,
    seq: 1,
    placeName: '합정 카페 A',
    memo: '디저트 괜찮았음',
    totalCost: 28000,
    payer: {
      roomMemberId: 101,
      nickname: '김구름',
      bankName: '신한은행',
      accountNumber: '110-1234-1234',
    },
    participants: [
      { roomMemberId: 101, nickname: '김구름', amount: 10000 },
      { roomMemberId: 102, nickname: '박구름', amount: 8000 },
      { roomMemberId: 103, nickname: '최구름', amount: 10000 },
    ],
    createdAt: '2026-06-20T19:30:00',
    updatedAt: null,
  },
  {
    recordId: 2,
    roomId: 45,
    seq: 2,
    placeName: '냥냥 룰루',
    memo: '분위기 최고',
    totalCost: 52000,
    payer: {
      roomMemberId: 103,
      nickname: '최구름',
      bankName: '카카오뱅크',
      accountNumber: '3333-1234-5678',
    },
    participants: [
      { roomMemberId: 101, nickname: '김구름', amount: 15000 },
      { roomMemberId: 102, nickname: '박구름', amount: 15000 },
      { roomMemberId: 104, nickname: '이구름', amount: 22000 },
    ],
    createdAt: '2026-06-20T21:00:00',
    updatedAt: null,
  },
  {
    recordId: 3,
    roomId: 45,
    seq: 3,
    placeName: '코인노래방',
    memo: '남은 인원끼리 30분',
    totalCost: 12000,
    payer: {
      roomMemberId: 102,
      nickname: '박구름',
      bankName: '국민은행',
      accountNumber: '004-21-098765',
    },
    participants: [
      { roomMemberId: 102, nickname: '박구름', amount: 6000 },
      { roomMemberId: 104, nickname: '이구름', amount: 6000 },
    ],
    createdAt: '2026-06-20T22:30:00',
    updatedAt: null,
  },
] as const;

export const receiptOcrSamplesDb = [
  {
    roomId: 45,
    storeName: '스타벅스 합정점',
    totalAmount: 16500,
    items: [
      { name: '아이스 아메리카노', price: 9000 },
      { name: '치즈케이크', price: 7500 },
    ],
  },
  {
    roomId: 45,
    storeName: '냥냥 룰루',
    totalAmount: 52000,
    items: [
      { name: '하이볼', price: 18000 },
      { name: '감바스', price: 24000 },
      { name: '감자튀김', price: 10000 },
    ],
  },
] as const;
