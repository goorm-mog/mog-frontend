export const settlementsDb = [
  {
    settlementId: 1,
    roomId: 45,
    totalCost: 92000,
    isConfirmed: true,
    confirmedAt: '2026-06-20T23:30:00',
    createdAt: '2026-06-20T23:00:00',
    memberSettlements: [
      {
        roomMemberId: 101,
        nickname: '김구름',
        totalAmount: 25000,
        detail: [
          {
            seq: 1,
            placeName: '합정 카페 A',
            amount: 10000,
            payer: {
              roomMemberId: 101,
              nickname: '김구름',
              bankName: '신한은행',
              accountNumber: '110-1234-1234',
            },
          },
          {
            seq: 2,
            placeName: '냥냥 룰루',
            amount: 15000,
            payer: {
              roomMemberId: 103,
              nickname: '최구름',
              bankName: '카카오뱅크',
              accountNumber: '3333-1234-5678',
            },
          },
        ],
      },
      {
        roomMemberId: 102,
        nickname: '박구름',
        totalAmount: 29000,
        detail: [
          {
            seq: 1,
            placeName: '합정 카페 A',
            amount: 8000,
            payer: {
              roomMemberId: 101,
              nickname: '김구름',
              bankName: '신한은행',
              accountNumber: '110-1234-1234',
            },
          },
          {
            seq: 2,
            placeName: '냥냥 룰루',
            amount: 15000,
            payer: {
              roomMemberId: 103,
              nickname: '최구름',
              bankName: '카카오뱅크',
              accountNumber: '3333-1234-5678',
            },
          },
          {
            seq: 3,
            placeName: '코인노래방',
            amount: 6000,
            payer: {
              roomMemberId: 102,
              nickname: '박구름',
              bankName: '국민은행',
              accountNumber: '004-21-098765',
            },
          },
        ],
      },
      {
        roomMemberId: 103,
        nickname: '최구름',
        totalAmount: 10000,
        detail: [
          {
            seq: 1,
            placeName: '합정 카페 A',
            amount: 10000,
            payer: {
              roomMemberId: 101,
              nickname: '김구름',
              bankName: '신한은행',
              accountNumber: '110-1234-1234',
            },
          },
        ],
      },
      {
        roomMemberId: 104,
        nickname: '이구름',
        totalAmount: 28000,
        detail: [
          {
            seq: 2,
            placeName: '냥냥 룰루',
            amount: 22000,
            payer: {
              roomMemberId: 103,
              nickname: '최구름',
              bankName: '카카오뱅크',
              accountNumber: '3333-1234-5678',
            },
          },
          {
            seq: 3,
            placeName: '코인노래방',
            amount: 6000,
            payer: {
              roomMemberId: 102,
              nickname: '박구름',
              bankName: '국민은행',
              accountNumber: '004-21-098765',
            },
          },
        ],
      },
    ],
  },
] as const;
