import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { notificationHandlers } from './notification';
import { recordsHandlers } from './records';
import { scheduleHandlers } from './schedule';
import { departureHandlers } from './departure';
import { midpointHandlers } from './midpoint';
import { settlementHandlers } from './settlement';
import { groupHandlers } from './group';
import { roomHandlers } from './room';
import { meetingRecordHandlers } from './meetingRecord';
import { summaryHandlers } from './summary';

export const handlers = [
  ...authHandlers,
  ...scheduleHandlers,
  ...chatHandlers,
  ...notificationHandlers,
  ...departureHandlers,
  ...midpointHandlers,
  ...settlementHandlers,
  ...groupHandlers,
  ...roomHandlers,
  ...meetingRecordHandlers,
  ...recordsHandlers,
  ...summaryHandlers,
];
