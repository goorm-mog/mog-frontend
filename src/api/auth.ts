import { setAuthSession } from '@/lib/auth-storage';
import type { LoginResponse } from '@/types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function loginWithKakao(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/auth/kakao`, {
    method: 'POST',
  });

  if (response.ok) {
    const data: LoginResponse = await response.json();
    setAuthSession(data);
    return data;
  }

  if (import.meta.env.DEV) {
    const { mockDb } = await import('@/mocks/fixtures/mockDb');
    const data: LoginResponse = {
      accessToken: mockDb.auth.accessToken,
      refreshToken: mockDb.auth.refreshToken,
      user: mockDb.auth.currentUser,
    };
    setAuthSession(data);
    return data;
  }

  throw new Error('카카오 로그인에 실패했습니다.');
}
