import { clearAuthSession, setAccessToken, setAuthSession } from '@/lib/auth-storage';
import type { ApiResponse, LoginResponse, ReissueResponse } from '@/types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function loginWithKakao(kakaoAccessToken = 'mock-kakao-access-token'): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/login/kakao`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken: kakaoAccessToken }),
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
      user: mockDb.auth.currentUser,
    };
    setAuthSession(data);
    return data;
  }

  throw new Error('카카오 로그인에 실패했습니다.');
}

export async function loginWithKakaoCode(code: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/login/kakao/code`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error('카카오 로그인에 실패했습니다.');
  }

  const data: LoginResponse = await response.json();
  setAuthSession(data);
  return data;
}

export async function reissueAccessToken(): Promise<ReissueResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/reissue`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('토큰 재발급에 실패했습니다.');
  }

  const data: ReissueResponse = await response.json();
  setAccessToken(data.accessToken);
  return data;
}

export async function logout(): Promise<ApiResponse<string>> {
  const response = await fetch(`${API_BASE}/api/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }

  const data: ApiResponse<string> = await response.json();
  clearAuthSession();
  return data;
}
