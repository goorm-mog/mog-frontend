import { HTTP_ERRORS } from '@/constants/errors';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = HTTP_ERRORS[response.status] ?? '알 수 없는 오류가 발생했습니다.';
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export function apiFetchNullOn404<T>(path: string, options?: RequestInit): Promise<T | null> {
  return apiFetch<T>(path, options).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
}
