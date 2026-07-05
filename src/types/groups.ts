export type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

export type GroupSummary = {
  groupId: number;
  groupName: string;
  memberCount: number;
};

export type GroupsResponse = ApiResponse<{
  groups: GroupSummary[];
}>;

export type GroupMember = {
  userId: number;
  nickname: string;
  role: 'LEADER' | 'MEMBER';
};

export type GroupRoom = {
  roomId: number;
  roomName: string;
  status: string;
  promiseDate: string;
};

export type GroupDetail = {
  groupId: number;
  groupName: string;
  inviteCode: string;
  myRole: 'LEADER' | 'MEMBER';
  members: GroupMember[];
  rooms: GroupRoom[];
};

export type GroupDetailResponse = ApiResponse<GroupDetail>;
