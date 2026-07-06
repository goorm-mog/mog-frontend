import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { scheduleHandlers } from './schedule';
import { departureHandlers } from './departure';

export const handlers = [...authHandlers, ...scheduleHandlers, ...chatHandlers, ...departureHandlers];
