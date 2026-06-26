export const notificationsDb = [
  {
    notificationId: 3,
    userId: 1,
    type: 'SETTLEMENT_DONE',
    message: '[대학 친구들] 정산이 완료됐습니다. 내 부담액: 25,000원',
    roomId: 45,
    isRead: false,
    createdAt: '2026-06-20T23:30:00',
  },
  {
    notificationId: 2,
    userId: 1,
    type: 'DATE_CONFIRMED',
    message: '[대학 친구들] 약속이 6월 20일 오후 6시 30분으로 확정됐습니다.',
    roomId: 45,
    isRead: false,
    createdAt: '2026-06-18T10:00:00',
  },
  {
    notificationId: 1,
    userId: 1,
    type: 'ROOM_CREATED',
    message: '[대학 친구들] 강남역 삼겹살 모임 방이 개설됐습니다.',
    roomId: 45,
    isRead: true,
    createdAt: '2026-06-16T14:30:00',
  },
] as const;
