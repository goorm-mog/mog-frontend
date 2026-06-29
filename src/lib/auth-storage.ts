import type { LoginResponse } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'mog_access_token';
const REFRESH_TOKEN_KEY = 'mog_refresh_token';

export function setAuthSession({ accessToken, refreshToken }: LoginResponse) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAuthSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
