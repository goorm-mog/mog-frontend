const ROOM_47_SLOTS = [
  { slotId: 10, roomId: 47, date: '2026-07-15', time: '11:00', votedUserIds: [1, 2, 3] },
  { slotId: 11, roomId: 47, date: '2026-07-15', time: '12:00', votedUserIds: [1, 2, 3, 4] },
  { slotId: 12, roomId: 47, date: '2026-07-16', time: '18:00', votedUserIds: [2, 4] },
  { slotId: 13, roomId: 47, date: '2026-07-18', time: '13:00', votedUserIds: [1, 3, 4] },
];

const ROOM_80_SLOTS = [
  { slotId: 20, roomId: 80, date: '2026-07-18', time: '07:30', votedUserIds: [1, 3, 5, 7] },
  { slotId: 21, roomId: 80, date: '2026-07-18', time: '08:00', votedUserIds: [3, 5, 7] },
  { slotId: 22, roomId: 80, date: '2026-07-19', time: '07:00', votedUserIds: [1, 7] },
];

export const scheduleSlotsDb = [...ROOM_47_SLOTS, ...ROOM_80_SLOTS] as const;

export const confirmedSchedulesDb = [
  {
    confirmedId: 1,
    roomId: 45,
    date: '2026-07-08',
    time: '18:30',
    confirmedBy: { userId: 1, nickname: '김구름' },
    kakaoEventId: 'kakao_event_room45',
    confirmedAt: '2026-07-05T10:00:00',
  },
  {
    confirmedId: 2,
    roomId: 46,
    date: '2026-07-03',
    time: '14:00',
    confirmedBy: { userId: 1, nickname: '김구름' },
    kakaoEventId: 'kakao_event_room46',
    confirmedAt: '2026-06-29T18:20:00',
  },
  {
    confirmedId: 3,
    roomId: 60,
    date: '2026-07-20',
    time: '10:00',
    confirmedBy: { userId: 5, nickname: '정바다' },
    kakaoEventId: 'kakao_event_room60',
    confirmedAt: '2026-07-01T09:00:00',
  },
  {
    confirmedId: 4,
    roomId: 61,
    date: '2026-06-30',
    time: '19:00',
    confirmedBy: { userId: 5, nickname: '정바다' },
    kakaoEventId: 'kakao_event_room61',
    confirmedAt: '2026-06-24T13:30:00',
  },
  {
    confirmedId: 5,
    roomId: 70,
    date: '2026-07-10',
    time: '09:00',
    confirmedBy: { userId: 1, nickname: '김구름' },
    kakaoEventId: 'kakao_event_room70',
    confirmedAt: '2026-07-02T20:00:00',
  },
] as const;
