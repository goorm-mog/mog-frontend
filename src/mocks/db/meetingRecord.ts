const calculateTotalPrice = (
  menuItems: readonly { count: number; price: number }[],
) => menuItems.reduce((total, { count, price }) => total + count * price, 0);

const rawMeetingRecords = [
  {
    recordId: 1,
    roomId: 45,
    seq: 1,
    placeName: '합정 카페 A',
    memo: '디저트 괜찮았음',
    menuItems: [
      { menuName: '김치전', count: 1, price: 14000 },
      { menuName: '어묵탕', count: 1, price: 14000 },
    ],
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
    photoCount: 3,
    createdAt: '2026-06-20T19:30:00',
  },
  {
    recordId: 2,
    roomId: 45,
    seq: 2,
    placeName: '냥냥 룰루',
    memo: '분위기 최고',
    menuItems: [
      { menuName: '하이볼', count: 2, price: 12000 },
      { menuName: '감자튀김', count: 1, price: 15000 },
      { menuName: '나쵸', count: 1, price: 13000 },
    ],
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
    photoCount: 2,
    createdAt: '2026-06-20T21:00:00',
  },
] as const;

export const meetingRecordsDb = rawMeetingRecords.map((record) => ({
  ...record,
  totalPrice: calculateTotalPrice(record.menuItems),
}));
