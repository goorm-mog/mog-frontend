import { mockDb } from '@/mocks/fixtures';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';

const getMeetRecordRoom = () => {
  const room = mockDb.rooms.find((item) =>
    mockDb.confirmedSchedules.some((schedule) => schedule.roomId === item.roomId),
  );

  if (!room) {
    throw new Error('MeetRecord mock room data is missing.');
  }

  return room;
};

export const meetRecordRoom = getMeetRecordRoom();

export const meetRecordGroup = mockDb.groups.find(
  ({ groupId }) => groupId === meetRecordRoom.groupId,
);

export const meetRecordSchedule = mockDb.confirmedSchedules.find(
  ({ roomId }) => roomId === meetRecordRoom.roomId,
);

export const meetRecordMembers = mockDb.roomMembers.filter(
  ({ roomId }) => roomId === meetRecordRoom.roomId,
);

export const initialMeetRecordReceipts: ReceiptCardData[] = [];
