import { authHandlers } from './auth';
import { groupHandlers } from './group';
import { notificationHandlers } from './notifications';
import { recordsHandlers } from './records';
import { roomHandlers } from './rooms';
import { scheduleHandlers } from './schedule';
import { settlementHandlers } from './settlement';

export const handlers = [
  ...authHandlers,
  ...groupHandlers,
  ...roomHandlers,
  ...scheduleHandlers,
  ...recordsHandlers,
  ...settlementHandlers,
  ...notificationHandlers,
];
