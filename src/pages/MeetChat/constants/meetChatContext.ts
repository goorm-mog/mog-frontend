import type { MeetChatParticipant, MeetChatRoom } from '@/types/chat';

const fallbackRoom: MeetChatRoom = {
  roomId: 45,
  groupId: 12,
  groupName: '대학 친구들',
  roomName: '강남역 삼겹살 모임',
  promiseDate: '2026-06-20T18:30:00',
  location: '강남역 11번 출구',
};

const fallbackParticipants: MeetChatParticipant[] = [
  { userId: 1, nickname: '김구름', status: 'joined' },
  { userId: 2, nickname: '박구름', status: 'host' },
  { userId: 3, nickname: '최구름', status: 'joined' },
  { userId: 4, nickname: '이구름', status: 'pending' },
];

export function getMeetChatContext(roomId: number) {
  return {
    room: {
      ...fallbackRoom,
      roomId,
    },
    participants: fallbackParticipants,
  };
}
