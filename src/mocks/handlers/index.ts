import { authHandlers } from './auth';
import { recordsHandlers } from './records';
import { scheduleHandlers } from './schedule';
import { settlementHandlers } from './settlement';

export const handlers = [
  ...authHandlers,
  ...scheduleHandlers,
  ...recordsHandlers,
  ...settlementHandlers,
];
