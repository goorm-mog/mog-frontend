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
    groupId: 13,
    groupName: '구름톤 스터디',
    inviteCode: 'STUDY9',
    kakaoShareUrl: 'https://mo-ge.site/join?code=STUDY9',
    createdAt: '2026-06-22T19:00:00',
    members: [
      { userId: 2, nickname: '박구름', role: 'LEADER' },
      { userId: 1, nickname: '김구름', role: 'MEMBER' },
      { userId: 3, nickname: '최구름', role: 'MEMBER' },
    ],
  },
  {
    groupId: 14,
    groupName: '회사 점심 모임',
    inviteCode: 'LUNCH4',
    kakaoShareUrl: 'https://mo-ge.site/join?code=LUNCH4',
    createdAt: '2026-06-28T12:10:00',
    members: [
      { userId: 3, nickname: '최구름', role: 'LEADER' },
      { userId: 1, nickname: '김구름', role: 'MEMBER' },
      { userId: 4, nickname: '이구름', role: 'MEMBER' },
    ],
  },
] as const;
