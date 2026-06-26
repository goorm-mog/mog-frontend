export const groupsDb = [
  {
    groupId: 12,
    groupName: '대학 친구들',
    inviteCode: 'UX7A2B',
    kakaoShareUrl: 'https://mo-ge.site/join?code=UX7A2B',
    createdAt: '2026-06-16T14:00:00',
    members: [
      { userId: 1, nickname: '김구름', role: 'LEADER' },
      { userId: 2, nickname: '박구름', role: 'MEMBER' },
      { userId: 3, nickname: '최구름', role: 'MEMBER' },
      { userId: 4, nickname: '이구름', role: 'MEMBER' },
    ],
  },
  {
    groupId: 15,
    groupName: '백엔드 자바 스터디',
    inviteCode: 'JAVA26',
    kakaoShareUrl: 'https://mo-ge.site/join?code=JAVA26',
    createdAt: '2026-06-10T09:30:00',
    members: [
      { userId: 1, nickname: '김구름', role: 'MEMBER' },
      { userId: 5, nickname: '정구름', role: 'LEADER' },
    ],
  },
] as const;
