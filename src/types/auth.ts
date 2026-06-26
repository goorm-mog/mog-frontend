export type AuthUser = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
