import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { mockDb } from './fixtures/mockDb';
import { setAuthSession } from '@/lib/auth-storage';

export const worker = setupWorker(...handlers);

// MSW 개발 환경에서 mock 인증 세션 자동 세팅 (로그인 플로우 없이도 userId 사용 가능)
setAuthSession({
  accessToken: mockDb.auth.accessToken,
  refreshToken: mockDb.auth.refreshToken,
  user: mockDb.auth.currentUser,
});