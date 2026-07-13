export type AuthUser = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
};

export type AuthLoginData = {
  accessToken: string;
  user: AuthUser;
};

export type LoginResponse = AuthLoginData & {
  refreshToken?: string;
};
