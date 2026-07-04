import {
  confirmedSchedulesDb,
  currentUser,
  groupsDb,
  meetingRecordPhotosDb,
  meetingRecordsDb,
  meetingRecordsResponseDb,
  notificationsDb,
  roomMembersDb,
  roomsDb,
  scheduleSlotsDb,
  settlementsDb,
  usersDb,
} from '../db';

export const mockDb = {
  auth: {
    currentUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  },
  users: usersDb,
  groups: groupsDb,
  rooms: roomsDb,
  roomMembers: roomMembersDb,
  scheduleSlots: scheduleSlotsDb,
  confirmedSchedules: confirmedSchedulesDb,
  meetingRecordPhotos: meetingRecordPhotosDb,
  meetingRecords: meetingRecordsDb,
  meetingRecordsResponse: meetingRecordsResponseDb,
  settlements: settlementsDb,
  notifications: notificationsDb,
} as const;

export type MockDb = typeof mockDb;
