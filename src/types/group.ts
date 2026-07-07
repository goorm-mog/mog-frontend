import type { ApiResponse } from '@/types/chat';

export type GroupRole = 'LEADER' | 'MEMBER';

export type HomeGroup = {
  id: number;
  name: string;
  memberCount: number;
};

export type GroupItem = {
  groupId: number;
  groupName: string;
  memberCount: number;
};

export type GroupListData = {
  groups: GroupItem[];
};

export type GroupListApiResponse = ApiResponse<GroupListData>;

export type GroupCreateBody = {
  groupName: string;
};

export type GroupCreateData = {
  groupId: number;
  groupName: string;
  inviteCode: string;
  kakaoShareUrl: string;
  createdAt: string;
};

export type GroupCreateApiResponse = ApiResponse<GroupCreateData>;

export type GroupUpdateBody = {
  groupName: string;
};

export type GroupUpdateData = {
  groupId: number;
  groupName: string;
  updatedAt: string;
};

export type GroupUpdateApiResponse = ApiResponse<GroupUpdateData>;

export type GroupDeleteApiResponse = ApiResponse<{
  groupId: number;
  deletedAt: string;
}>;

export type GroupDetail = {
  groupId: number;
  groupName: string;
  inviteCode: string;
  myRole: GroupRole;
  members: {
    userId: number;
    nickname: string;
    role: GroupRole;
  }[];
  rooms: {
    roomId: number;
    roomName: string;
    status: 'VOTING' | 'RECORDING' | 'COMPLETED';
    promiseDate?: string;
  }[];
};

export type GroupDetailApiResponse = ApiResponse<GroupDetail>;

export function toHomeGroup(group: GroupItem): HomeGroup {
  return {
    id: group.groupId,
    name: group.groupName,
    memberCount: group.memberCount,
  };
}
