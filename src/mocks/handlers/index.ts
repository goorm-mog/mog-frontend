import { authHandlers } from './auth';
import { groupHandlers } from './group';
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
];
