import { chatParticipantsDb, groupsDb, meetingRecordsDb, roomsDb, usersDb } from '@/mocks/db';
import type {
  MeetChatParticipant,
  MeetChatParticipantStatus,
  MeetChatRoom,
} from '@/types/chat';

const toChatStatus = (status: string): MeetChatParticipantStatus => {
  if (status === 'host' || status === 'pending') return status;
  return 'joined';
};

const getFallbackRoom = () => {
  const room = roomsDb.find((room) => room.members.length > 0);

  if (!room) {
    throw new Error('MeetChat mock room data is missing.');
  }

  return room;
};

const buildRoomContext = (roomId: number): MeetChatRoom => {
  const room = roomsDb.find((item) => item.roomId === roomId) ?? getFallbackRoom();
  const group = groupsDb.find((item) => item.groupId === room.groupId);
  const firstRecord = meetingRecordsDb.find((record) => record.roomId === room.roomId);

  return {
    roomId: room.roomId,
    groupId: room.groupId,
    groupName: group?.groupName ?? '',
    roomName: room.roomName,
    promiseDate: room.promiseDate ?? '',
    location: firstRecord?.placeName ?? '',
  };
};

const buildParticipantsContext = (roomId: number): MeetChatParticipant[] => {
  const room = roomsDb.find((item) => item.roomId === roomId) ?? getFallbackRoom();
  const chatParticipants = chatParticipantsDb.filter((participant) => participant.roomId === room.roomId);

  if (chatParticipants.length > 0) {
    return chatParticipants.map(({ userId, status }) => {
      const user = usersDb.find((item) => item.userId === userId);
      const roomMember = room.members.find((member) => member.userId === userId);

      return {
        userId,
        nickname: roomMember?.nickname ?? user?.nickname ?? '',
        profileImageUrl: user?.profileImageUrl,
        status: toChatStatus(status),
      };
    });
  }

  return room.members.map(({ userId, nickname, role }) => {
    const user = usersDb.find((item) => item.userId === userId);

    return {
      userId,
      nickname,
      profileImageUrl: user?.profileImageUrl,
      status: role === 'HOST' ? 'host' : 'joined',
    };
  });
};

export function getMeetChatContext(roomId: number) {
  const room = buildRoomContext(roomId);

  return {
    room,
    participants: buildParticipantsContext(room.roomId),
  };
}
