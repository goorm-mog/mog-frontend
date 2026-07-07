import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { scheduleHandlers } from './schedule';
import { departureHandlers } from './departure';
import { midpointHandlers } from './midpoint';

export const handlers = [...authHandlers, ...scheduleHandlers, ...chatHandlers, ...departureHandlers, ...midpointHandlers];
