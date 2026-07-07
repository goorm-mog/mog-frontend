import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { notificationHandlers } from './notification';
import { scheduleHandlers } from './schedule';
import { departureHandlers } from './departure';
import { settlementHandlers } from './settlement';
import { groupHandlers } from './group';
import { meetingRecordHandlers } from './meetingRecord';

export const handlers = [
  ...authHandlers,
  ...scheduleHandlers,
  ...chatHandlers,
  ...notificationHandlers,
  ...departureHandlers,
  ...settlementHandlers,
  ...groupHandlers,
  ...meetingRecordHandlers,
];
