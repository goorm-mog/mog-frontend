import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { scheduleHandlers } from './schedule';

export const handlers = [...authHandlers, ...scheduleHandlers, ...chatHandlers];
