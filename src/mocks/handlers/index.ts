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

export const authOnlyHandlers = [...authHandlers];

export const allHandlers = [
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

export const handlers =
  import.meta.env.VITE_MSW_MODE === 'auth-only' ||
  import.meta.env.VITE_MSW_MODE === 'network-first'
    ? authOnlyHandlers
    : allHandlers;
