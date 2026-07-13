export const settlementsDb = [
  {
    settlementId: 1,
    roomId: 45,
    totalCost: 128000,
    isConfirmed: false,
    confirmedAt: null,
    createdAt: '2026-07-08T22:30:00',
    memberSettlements: [
      {
        roomMemberId: 101,
        nickname: '김구름',
        totalAmount: 38000,
        detail: [
          { seq: 1, placeName: '팔색삼겹살 강남점', amount: 18000 },
          { seq: 2, placeName: '카페 노티드 강남', amount: 12000 },
          { seq: 3, placeName: '인생네컷 강남역점', amount: 8000 },
        ],
      },
      {
        roomMemberId: 102,
        nickname: '박구름',
        totalAmount: 28000,
        detail: [
          { seq: 1, placeName: '팔색삼겹살 강남점', amount: 18000 },
          { seq: 2, placeName: '카페 노티드 강남', amount: 10000 },
        ],
      },
      {
        roomMemberId: 103,
        nickname: '최구름',
        totalAmount: 26000,
        detail: [
          { seq: 1, placeName: '팔색삼겹살 강남점', amount: 18000 },
          { seq: 3, placeName: '인생네컷 강남역점', amount: 8000 },
        ],
      },
      {
        roomMemberId: 104,
        nickname: '이구름',
        totalAmount: 36000,
        detail: [
          { seq: 1, placeName: '팔색삼겹살 강남점', amount: 18000 },
          { seq: 2, placeName: '카페 노티드 강남', amount: 10000 },
          { seq: 3, placeName: '인생네컷 강남역점', amount: 8000 },
        ],
      },
    ],
  },
  {
    settlementId: 2,
    roomId: 46,
    totalCost: 45000,
    isConfirmed: true,
    confirmedAt: '2026-07-03T18:00:00',
    createdAt: '2026-07-03T17:40:00',
    memberSettlements: [
      {
        roomMemberId: 201,
        nickname: '김구름',
        totalAmount: 18000,
        detail: [
          { seq: 1, placeName: '홍대 보드게임 카페 레드버튼', amount: 9000 },
          { seq: 2, placeName: '홍대 분식 연구소', amount: 9000 },
        ],
      },
      {
        roomMemberId: 202,
        nickname: '박구름',
        totalAmount: 9000,
        detail: [{ seq: 1, placeName: '홍대 보드게임 카페 레드버튼', amount: 9000 }],
      },
      {
        roomMemberId: 203,
        nickname: '최구름',
        totalAmount: 18000,
        detail: [
          { seq: 1, placeName: '홍대 보드게임 카페 레드버튼', amount: 9000 },
          { seq: 2, placeName: '홍대 분식 연구소', amount: 9000 },
        ],
      },
    ],
  },
  {
    settlementId: 3,
    roomId: 60,
    totalCost: 94000,
    isConfirmed: false,
    confirmedAt: null,
    createdAt: '2026-07-20T15:30:00',
    memberSettlements: [
      {
        roomMemberId: 401,
        nickname: '정바다',
        totalAmount: 22000,
        detail: [
          { seq: 1, placeName: '성수 세미나룸 A', amount: 13000 },
          { seq: 2, placeName: '성수 블루보틀', amount: 9000 },
        ],
      },
      {
        roomMemberId: 402,
        nickname: '김구름',
        totalAmount: 13000,
        detail: [{ seq: 1, placeName: '성수 세미나룸 A', amount: 13000 }],
      },
      {
        roomMemberId: 403,
        nickname: '한별',
        totalAmount: 23000,
        detail: [
          { seq: 1, placeName: '성수 세미나룸 A', amount: 13000 },
          { seq: 2, placeName: '성수 블루보틀', amount: 10000 },
        ],
      },
      {
        roomMemberId: 404,
        nickname: '윤초록',
        totalAmount: 13000,
        detail: [{ seq: 1, placeName: '성수 세미나룸 A', amount: 13000 }],
      },
      {
        roomMemberId: 405,
        nickname: '서민준',
        totalAmount: 23000,
        detail: [
          { seq: 1, placeName: '성수 세미나룸 A', amount: 13000 },
          { seq: 2, placeName: '성수 블루보틀', amount: 10000 },
        ],
      },
    ],
  },
  {
    settlementId: 4,
    roomId: 61,
    totalCost: 79000,
    isConfirmed: true,
    confirmedAt: '2026-06-30T21:10:00',
    createdAt: '2026-06-30T21:05:00',
    memberSettlements: [
      {
        roomMemberId: 501,
        nickname: '정바다',
        totalAmount: 27000,
        detail: [
          { seq: 1, placeName: '을지로 와인바 낮달', amount: 19000 },
          { seq: 2, placeName: '을지로 베이커리', amount: 8000 },
        ],
      },
      {
        roomMemberId: 502,
        nickname: '한별',
        totalAmount: 19000,
        detail: [{ seq: 1, placeName: '을지로 와인바 낮달', amount: 19000 }],
      },
      {
        roomMemberId: 503,
        nickname: '오하린',
        totalAmount: 33000,
        detail: [
          { seq: 1, placeName: '을지로 와인바 낮달', amount: 19000 },
          { seq: 2, placeName: '을지로 베이커리', amount: 14000 },
        ],
      },
    ],
  },
  {
    settlementId: 5,
    roomId: 70,
    totalCost: 320000,
    isConfirmed: true,
    confirmedAt: '2026-07-10T18:10:00',
    createdAt: '2026-07-10T18:00:00',
    memberSettlements: [
      {
        roomMemberId: 601,
        nickname: '김구름',
        totalAmount: 80000,
        detail: [
          { seq: 1, placeName: '강릉 경포대 펜션', amount: 45000 },
          { seq: 2, placeName: '초당 순두부 마을', amount: 22000 },
          { seq: 3, placeName: '안목해변 카페거리', amount: 13000 },
        ],
      },
      {
        roomMemberId: 602,
        nickname: '서민준',
        totalAmount: 80000,
        detail: [
          { seq: 1, placeName: '강릉 경포대 펜션', amount: 45000 },
          { seq: 2, placeName: '초당 순두부 마을', amount: 22000 },
          { seq: 3, placeName: '안목해변 카페거리', amount: 13000 },
        ],
      },
      {
        roomMemberId: 603,
        nickname: '오하린',
        totalAmount: 80000,
        detail: [
          { seq: 1, placeName: '강릉 경포대 펜션', amount: 45000 },
          { seq: 2, placeName: '초당 순두부 마을', amount: 22000 },
          { seq: 3, placeName: '안목해변 카페거리', amount: 13000 },
        ],
      },
      {
        roomMemberId: 604,
        nickname: '강도윤',
        totalAmount: 80000,
        detail: [
          { seq: 1, placeName: '강릉 경포대 펜션', amount: 45000 },
          { seq: 2, placeName: '초당 순두부 마을', amount: 22000 },
          { seq: 3, placeName: '안목해변 카페거리', amount: 13000 },
        ],
      },
    ],
  },
] as const;
