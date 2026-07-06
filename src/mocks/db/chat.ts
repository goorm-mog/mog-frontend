export const chatParticipantsDb = [
  { roomId: 45, userId: 1, status: 'joined' },
  { roomId: 45, userId: 2, status: 'host' },
  { roomId: 45, userId: 3, status: 'joined' },
  { roomId: 45, userId: 4, status: 'pending' },
] as const;

export const chatMessagesDb = [
  {
    roomId: 45,
    senderId: 2,
    senderName: '박구름',
    message: '이번 주 일요일에 강남역에서 만나서 저녁 먹고 근처 카페 갈까요?',
    timestamp: '2026-07-05T13:10:00',
  },
  {
    roomId: 45,
    senderId: 3,
    senderName: '최구름',
    message: '좋아요. 저는 6시 반부터 가능해요.',
    timestamp: '2026-07-05T13:12:00',
  },
  {
    roomId: 45,
    senderId: 1,
    senderName: '김구름',
    message: '그럼 6시 반에 강남역 11번 출구 앞에서 만나는 걸로 할게요.',
    timestamp: '2026-07-05T13:15:00',
  },
  {
    roomId: 45,
    senderId: 2,
    senderName: '박구름',
    message: '늦는 사람 있으면 여기서 바로 알려주세요. 예약 시간 맞춰서 먼저 들어갈게요.',
    timestamp: '2026-07-05T13:18:00',
  },
] as const;
