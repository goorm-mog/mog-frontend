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
  {
    slotId: 12,
    roomId: 45,
    date: '2026-06-22',
    time: '20:00',
    votedUserIds: [1, 3, 4],
  },
] as const;

export const confirmedSchedulesDb = [
  {
    confirmedId: 1,
    roomId: 45,
    date: '2026-06-20',
    time: '18:30',
    confirmedBy: {
      userId: 5,
      nickname: '정구름',
    },
    kakaoEventId: 'kakao_event_abc123',
    confirmedAt: '2026-06-18T10:00:00',
  },
] as const;
