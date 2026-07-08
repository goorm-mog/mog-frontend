import { mockDb } from '@/mocks/fixtures';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';

export const meetRecordRoom = mockDb.rooms[0];

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
