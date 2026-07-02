import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export const authHandlers: HttpHandler[] = [
  http.post(`${BASE}/api/auth/kakao`, () => {
    return HttpResponse.json({
      accessToken: mockDb.auth.accessToken,
      refreshToken: mockDb.auth.refreshToken,
      user: mockDb.auth.currentUser,
    });
  }),
];
