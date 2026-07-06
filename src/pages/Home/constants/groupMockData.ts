export type HomeGroup = {
  id: number;
  name: string;
  memberCount: number;
};

export const HOME_GROUPS: HomeGroup[] = [
  { id: 12, name: '대학 친구들', memberCount: 4 },
  { id: 13, name: '브랜드 팀', memberCount: 6 },
  { id: 14, name: '가족 모임', memberCount: 3 },
];
