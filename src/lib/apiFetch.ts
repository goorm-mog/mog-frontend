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
const SHOULD_FALLBACK_TO_MOCK =
  import.meta.env.DEV &&
  import.meta.env.VITE_MSW_ENABLED === 'true' &&
  import.meta.env.VITE_MSW_MODE === 'network-first';

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

  const request = {
    ...options,
    headers,
  };

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, request);
  } catch (error) {
    const mockResponse = await fetchMockFallback(path, request);

    if (mockResponse) {
      return mockResponse.json() as Promise<T>;
    }

    throw error;
  }

  if (!response.ok) {
    const mockResponse = await fetchMockFallback(path, request);

    if (mockResponse?.ok) {
      return mockResponse.json() as Promise<T>;
    }

    const errorBody = await parseErrorResponse(response);
    const message =
      errorBody?.message ??
      HTTP_ERRORS[response.status] ??
      '알 수 없는 오류가 발생했습니다.';
    throw new ApiError(response.status, message, errorBody?.code);
  }

  return response.json() as Promise<T>;
}

async function fetchMockFallback(path: string, options: RequestInit): Promise<Response | null> {
  if (!SHOULD_FALLBACK_TO_MOCK || path.startsWith('/api/v1/auth/')) {
    return null;
  }

  const [{ worker }, { allHandlers, authOnlyHandlers }] = await Promise.all([
    import('@/mocks/browser'),
    import('@/mocks/handlers'),
  ]);

  worker.use(...allHandlers);

  try {
    return await fetch(`${API_BASE}${path}`, options);
  } finally {
    worker.resetHandlers(...authOnlyHandlers);
  }
}

export function apiFetchNullOn404<T>(path: string, options?: RequestInit): Promise<T | null> {
  return apiFetch<T>(path, options).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
}
