import { apiFetch } from '@/lib/apiFetch';
import { clearAuthSession, setAccessToken, setAuthSession } from '@/lib/auth-storage';
import type { ApiResponse, LoginResponse, ReissueResponse } from '@/types/auth';

export async function loginWithKakao(kakaoAccessToken = 'mock-kakao-access-token'): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/api/v1/auth/login/kakao', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ accessToken: kakaoAccessToken }),
  });

  setAuthSession(data);
  return data;
}

export async function loginWithKakaoCode(code: string): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>('/api/v1/auth/login/kakao/code', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  setAuthSession(data);
  return data;
}

export async function reissueAccessToken(): Promise<ReissueResponse> {
  const data = await apiFetch<ReissueResponse>('/api/v1/auth/reissue', {
    method: 'POST',
    credentials: 'include',
  });

  setAccessToken(data.accessToken);
  return data;
}

export async function logout(): Promise<ApiResponse<string>> {
  const data = await apiFetch<ApiResponse<string>>('/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  clearAuthSession();
  return data;
}
