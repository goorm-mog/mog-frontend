import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { notificationHandlers } from './notification';
import { recordsHandlers } from './records';
import { scheduleHandlers } from './schedule';
import { departureHandlers } from './departure';
import { settlementHandlers } from './settlement';
import { groupHandlers } from './group';
import { roomHandlers } from './room';
import { meetingRecordHandlers } from './meetingRecord';

export const handlers = [
  ...authHandlers,
  ...scheduleHandlers,
  ...chatHandlers,
  ...notificationHandlers,
  ...departureHandlers,
  ...settlementHandlers,
  ...groupHandlers,
  ...roomHandlers,
  ...meetingRecordHandlers,
  ...recordsHandlers
];
