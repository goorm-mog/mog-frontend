export const fixtures = {
  users: [
    { id: '1', name: '홍길동', email: 'hong@example.com', role: 'admin' },
  ],
  errors: {
    unauthorized: { status: 401, message: '인증이 필요합니다.' },
    notFound: { status: 404, message: '리소스를 찾을 수 없습니다.' },
  },
};