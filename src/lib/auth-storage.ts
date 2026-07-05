import type { LoginResponse } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'mog_access_token';
const USER_ID_KEY = 'mog_user_id';

export function setAuthSession({ accessToken, user }: LoginResponse) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(USER_ID_KEY, String(user.userId));
}

export function setAccessToken(accessToken: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getMyUserId(): number | null {
  const val = sessionStorage.getItem(USER_ID_KEY);
  return val ? Number(val) : null;
}

export function clearAuthSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}
