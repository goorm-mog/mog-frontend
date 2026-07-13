import { HTTP_ERRORS } from '@/constants/errors';
import { apiFetch, ApiError } from '@/lib/apiFetch';
import { setAuthSession, clearAuthSession } from '@/lib/auth-storage';
import type { ApiResponse } from '@/types/api';
import type { AuthLoginData, LoginResponse } from '@/types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function loginWithKakaoCode(code: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/v1/auth/login/kakao/code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  const payload = (await response.json()) as ApiResponse<AuthLoginData>;

  if (!response.ok || !payload.data) {
    const message =
      payload.message ?? HTTP_ERRORS[response.status] ?? '카카오 로그인에 실패했습니다.';
    throw new ApiError(response.status, message);
  }

  const data: LoginResponse = payload.data;
  setAuthSession(data);
  return data;
}

export async function logout() {
  try {
    await apiFetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    clearAuthSession();
  }
}
