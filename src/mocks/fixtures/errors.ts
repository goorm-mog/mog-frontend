export const errors = {
  unauthorized: {
    status: 401,
    code: 'UNAUTHORIZED',
    message: '인증이 필요합니다.',
    data: null,
  },
  forbidden: {
    status: 403,
    code: 'FORBIDDEN',
    message: '해당 리소스에 접근할 권한이 없습니다.',
    data: null,
  },
  notFound: {
    status: 404,
    code: 'NOT_FOUND',
    message: '리소스를 찾을 수 없습니다.',
    data: null,
  },
} as const;
