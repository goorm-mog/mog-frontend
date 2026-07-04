import { authHandlers } from './auth';
import { recordsHandlers } from './records';
import { scheduleHandlers } from './schedule';

export const handlers = [...authHandlers, ...scheduleHandlers, ...recordsHandlers];
