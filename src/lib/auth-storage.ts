import type { LoginResponse } from '@/types/auth';
import type { GroupRole } from '@/types/group';

const ACCESS_TOKEN_KEY = 'mog_access_token';
const REFRESH_TOKEN_KEY = 'mog_refresh_token';
const USER_ID_KEY = 'mog_user_id';

export function setAuthSession({ accessToken, refreshToken, user }: LoginResponse) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  sessionStorage.setItem(USER_ID_KEY, String(user.userId));
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getMyUserId(): number | null {
  if (import.meta.env.VITE_MSW_ENABLED === 'true') {
    return window.location.pathname.includes('/participant/') ? 3 : 1;
  }
  const val = sessionStorage.getItem(USER_ID_KEY);
  return val ? Number(val) : null;
}

export function clearAuthSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}

const ROOM_ROLES_KEY = 'mog_room_roles';

export function setRoomRole(roomId: number, role: GroupRole): void {
  try {
    const raw = sessionStorage.getItem(ROOM_ROLES_KEY);
    const current: Record<string, GroupRole> = raw ? JSON.parse(raw) : {};
    sessionStorage.setItem(ROOM_ROLES_KEY, JSON.stringify({ ...current, [roomId]: role }));
  } catch {
    // ignore
  }
}

export function getRoomRole(roomId: number): GroupRole | null {
  try {
    const raw = sessionStorage.getItem(ROOM_ROLES_KEY);
    if (!raw) return null;
    const roles: Record<string, GroupRole> = JSON.parse(raw);
    return roles[String(roomId)] ?? null;
  } catch {
    return null;
  }
}
