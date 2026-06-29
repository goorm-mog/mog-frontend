import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';

export const handlers: HttpHandler[] = [
  http.post('/api/auth/kakao', () => {
    return HttpResponse.json({
      accessToken: mockDb.auth.accessToken,
      refreshToken: mockDb.auth.refreshToken,
      user: mockDb.auth.currentUser,
    });
  }),
];
