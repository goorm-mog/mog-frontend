import { authHandlers } from './auth';
import { groupHandlers } from './group';
import { recordsHandlers } from './records';
import { scheduleHandlers } from './schedule';
import { settlementHandlers } from './settlement';

export const handlers = [
  ...authHandlers,
  ...groupHandlers,
  ...scheduleHandlers,
  ...recordsHandlers,
  ...settlementHandlers,
];
