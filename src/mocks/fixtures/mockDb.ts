import {
  confirmedSchedulesDb,
  currentUser,
  groupsDb,
  meetingRecordsDb,
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
  meetingRecords: meetingRecordsDb,
  settlements: settlementsDb,
  notifications: notificationsDb,
} as const;

export type MockDb = typeof mockDb;
