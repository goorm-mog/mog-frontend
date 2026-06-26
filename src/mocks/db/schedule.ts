export const scheduleSlotsDb = [
  {
    slotId: 10,
    roomId: 45,
    date: '2026-06-20',
    time: '18:30',
    votedUserIds: [1, 2, 3],
  },
  {
    slotId: 11,
    roomId: 45,
    date: '2026-06-21',
    time: '19:00',
    votedUserIds: [2],
  },
] as const;

export const confirmedSchedulesDb = [
  {
    confirmedId: 1,
    roomId: 45,
    date: '2026-06-20',
    time: '18:30',
    confirmedBy: {
      userId: 1,
      nickname: '김구름',
    },
    kakaoEventId: 'kakao_event_abc123',
    confirmedAt: '2026-06-18T10:00:00',
  },
] as const;
