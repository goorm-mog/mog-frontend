import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

type AuthErrorData = {
  accessToken: string;
  user?: typeof mockDb.auth.currentUser;
};

const createRefreshToken = () => `mock-refresh-token-${Date.now()}`;

let activeRefreshToken: string = mockDb.auth.refreshToken;

const ok = (message: string, data: string) => ({
  status: 0,
  code: 'SUCCESS',
  message,
  data,
});

const authError = (status: number, code: string, message: string, data: AuthErrorData) =>
  HttpResponse.json(
    {
      status,
      code,
      message,
      data,
    },
    { status },
  );

const hasValidRefreshToken = (request: Request) => {
  const cookie = request.headers.get('cookie');

  if (!cookie) {
    return Boolean(activeRefreshToken);
  }

  return cookie.split(';').some((item) => {
    const [name, value] = item.trim().split('=');
    return name === REFRESH_TOKEN_COOKIE && value === activeRefreshToken;
  });
};

const setRefreshTokenCookie = (token: string) => ({
  'Set-Cookie': `${REFRESH_TOKEN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax`,
});

const expireRefreshTokenCookie = {
  'Set-Cookie': `${REFRESH_TOKEN_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`,
};

export const authHandlers: HttpHandler[] = [
  http.post(`${BASE}/api/v1/auth/reissue`, ({ request }) => {
    if (!hasValidRefreshToken(request)) {
      return authError(401, 'INVALID_REFRESH_TOKEN', 'Refresh Token이 없거나 유효하지 않습니다.', {
        accessToken: '',
      });
    }

    activeRefreshToken = createRefreshToken();

    return HttpResponse.json(
      {
        accessToken: `${mockDb.auth.accessToken}-reissued`,
      },
      {
        headers: setRefreshTokenCookie(activeRefreshToken),
      },
    );
  }),

  http.post(`${BASE}/api/v1/auth/logout`, ({ request }) => {
    if (hasValidRefreshToken(request)) {
      activeRefreshToken = '';
    }

    return HttpResponse.json(ok('로그아웃에 성공했습니다.', 'logout'), {
      headers: expireRefreshTokenCookie,
    });
  }),

  http.post(`${BASE}/api/v1/auth/login/kakao`, async ({ request }) => {
    const { accessToken } = (await request.json()) as { accessToken?: string };

    if (!accessToken?.trim()) {
      return authError(400, 'INVALID_KAKAO_TOKEN', '유효하지 않은 카카오 토큰입니다.', {
        accessToken: '',
        user: mockDb.auth.currentUser,
      });
    }

    activeRefreshToken = createRefreshToken();

    return HttpResponse.json(
      {
        accessToken: mockDb.auth.accessToken,
        user: mockDb.auth.currentUser,
      },
      {
        headers: setRefreshTokenCookie(activeRefreshToken),
      },
    );
  }),

  http.post(`${BASE}/api/v1/auth/login/kakao/code`, async ({ request }) => {
    const { code } = (await request.json()) as { code?: string };

    if (!code?.trim()) {
      return authError(400, 'INVALID_KAKAO_CODE', '유효하지 않은 카카오 인가코드입니다.', {
        accessToken: '',
        user: mockDb.auth.currentUser,
      });
    }

    activeRefreshToken = createRefreshToken();

    return HttpResponse.json(
      {
        accessToken: mockDb.auth.accessToken,
        user: mockDb.auth.currentUser,
      },
      {
        headers: setRefreshTokenCookie(activeRefreshToken),
      },
    );
  }),
];
