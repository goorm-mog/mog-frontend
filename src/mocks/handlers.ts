import { http, HttpResponse } from 'msw';
import { fixtures } from './fixtures';

export const handlers = [
  http.get('/api/users', () => HttpResponse.json(fixtures.users)),
];