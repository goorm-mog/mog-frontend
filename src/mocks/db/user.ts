export const usersDb = [
  {
    userId: 1,
    nickname: '김구름',
    profileImageUrl: 'https://k.kakaocdn.net/mog/profile/user-1.jpg',
  },
  {
    userId: 2,
    nickname: '박구름',
    profileImageUrl: 'https://k.kakaocdn.net/mog/profile/user-2.jpg',
  },
  {
    userId: 3,
    nickname: '최구름',
    profileImageUrl: 'https://k.kakaocdn.net/mog/profile/user-3.jpg',
  },
  {
    userId: 4,
    nickname: '이구름',
    profileImageUrl: 'https://k.kakaocdn.net/mog/profile/user-4.jpg',
  },
] as const;

export const currentUser = usersDb[0];
