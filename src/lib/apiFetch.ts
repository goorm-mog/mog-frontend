import { HTTP_ERRORS } from '@/constants/errors';
import { getAccessToken } from '@/lib/auth-storage';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

type ErrorResponseBody = {
  code?: string;
  message?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function parseErrorResponse(response: Response): Promise<ErrorResponseBody | null> {
  try {
    const body = await response.clone().json();

    if (body && typeof body === 'object') {
      return body as ErrorResponseBody;
    }
  } catch {
    return null;
  }

  return null;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const accessToken = getAccessToken();
  const headers = new Headers(options?.headers);
  const isFormData = options?.body instanceof FormData;

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await parseErrorResponse(response);
    const message =
      errorBody?.message ??
      HTTP_ERRORS[response.status] ??
      '알 수 없는 오류가 발생했습니다.';
    throw new ApiError(response.status, message, errorBody?.code);
  }

  return response.json() as Promise<T>;
}

export function apiFetchNullOn404<T>(path: string, options?: RequestInit): Promise<T | null> {
  return apiFetch<T>(path, options).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
}
