export const settlementsDb = [
  {
    settlementId: 1,
    roomId: 45,
    totalCost: 80000,
    isConfirmed: false,
    confirmedAt: null,
    createdAt: '2026-06-20T23:00:00',
    memberSettlements: [
      {
        roomMemberId: 101,
        nickname: '김구름',
        totalAmount: 25000,
        detail: [
          { seq: 1, placeName: '합정 카페 A', amount: 10000 },
          { seq: 2, placeName: '냥냥 룰루', amount: 15000 },
        ],
      },
      {
        roomMemberId: 102,
        nickname: '박구름',
        totalAmount: 23000,
        detail: [
          { seq: 1, placeName: '합정 카페 A', amount: 8000 },
          { seq: 2, placeName: '냥냥 룰루', amount: 15000 },
        ],
      },
      {
        roomMemberId: 103,
        nickname: '최구름',
        totalAmount: 10000,
        detail: [{ seq: 1, placeName: '합정 카페 A', amount: 10000 }],
      },
      {
        roomMemberId: 104,
        nickname: '이구름',
        totalAmount: 22000,
        detail: [{ seq: 2, placeName: '냥냥 룰루', amount: 22000 }],
      },
    ],
  },
] as const;
