import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { notificationHandlers } from './notification';
import { scheduleHandlers } from './schedule';
import { departureHandlers } from './departure';

export const handlers = [
  ...authHandlers,
  ...scheduleHandlers,
  ...chatHandlers,
  ...notificationHandlers,
  ...departureHandlers,
];
