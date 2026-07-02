import { authHandlers } from './auth';
import { scheduleHandlers } from './schedule';

export const handlers = [...authHandlers, ...scheduleHandlers];
