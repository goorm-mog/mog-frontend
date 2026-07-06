import { authHandlers } from './auth';
import { scheduleHandlers } from './schedule';
import { departureHandlers } from './departure';

export const handlers = [...authHandlers, ...scheduleHandlers, ...departureHandlers];
