export const summaryCardsDb = [
  {
    roomId: 45,
    confirmedDate: '2026-06-20',
    confirmedPlace: '스시조',
    totalMemberCount: 4,
    members: ['김구름', '박구름', '최구름', '이구름'],
    photos: [
      'https://s3.amazonaws.com/mog/photos/room/45/photo1.jpg',
      'https://s3.amazonaws.com/mog/photos/room/45/photo2.jpg',
      'https://s3.amazonaws.com/mog/photos/room/45/photo3.jpg',
    ],
    records: [
      {
        seq: 1,
        placeName: '합정 카페 A',
        memo: '디저트 괜찮았음',
        totalCost: 28000,
        participants: [
          { nickname: '김구름', amount: 10000 },
          { nickname: '박구름', amount: 8000 },
          { nickname: '최구름', amount: 10000 },
        ],
      },
      {
        seq: 2,
        placeName: '냥냥 룰루',
        memo: '분위기 최고',
        totalCost: 52000,
        participants: [
          { nickname: '김구름', amount: 15000 },
          { nickname: '박구름', amount: 15000 },
          { nickname: '이구름', amount: 22000 },
        ],
      },
      {
        seq: 3,
        placeName: '코인노래방',
        memo: '남은 인원끼리 30분',
        totalCost: 12000,
        participants: [
          { nickname: '박구름', amount: 6000 },
          { nickname: '이구름', amount: 6000 },
        ],
      },
    ],
    settlement: {
      totalCost: 92000,
      memberTotals: [
        { nickname: '김구름', totalAmount: 25000 },
        { nickname: '박구름', totalAmount: 29000 },
        { nickname: '최구름', totalAmount: 10000 },
        { nickname: '이구름', totalAmount: 28000 },
      ],
    },
    cardImageUrl: 'https://s3.amazonaws.com/mog/cards/room/45/card.png',
  },
] as const;
