export const errors = {
  unauthorized: {
    status: 401,
    code: 'UNAUTHORIZED',
    message: '인증이 필요합니다.',
    data: null,
  },
  notFound: {
    status: 404,
    code: 'NOT_FOUND',
    message: '리소스를 찾을 수 없습니다.',
    data: null,
  },
} as const;
