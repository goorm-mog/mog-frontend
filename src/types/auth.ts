export type AuthUser = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type ReissueResponse = {
  accessToken: string;
};

export type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};
