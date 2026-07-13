import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export const authHandlers: HttpHandler[] = [
  http.post(`${BASE}/api/v1/auth/login/kakao/code`, async ({ request }) => {
    const body = (await request.json()) as { code?: string };

    if (!body.code) {
      return HttpResponse.json(
        {
          status: 400,
          code: 'BAD_REQUEST',
          message: '인증 코드가 필요합니다.',
          data: null,
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: 200,
      code: 'OK',
      message: 'success',
      data: {
        accessToken: mockDb.auth.accessToken,
        user: mockDb.auth.currentUser,
      },
    });
  }),

  http.post(`${BASE}/api/v1/auth/logout`, () => {
    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '로그아웃 성공',
      data: null,
    });
  }),
];
