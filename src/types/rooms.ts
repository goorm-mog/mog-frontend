export type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

export type RoomStatus = 'PROCEEDING' | 'COMPLETED' | 'CANCELED';

export type RoomMemberRole = 'HOST' | 'MEMBER';

export type RoomMember = {
  roomMemberId: number;
  roomId: number;
  userId: number;
  nickname: string;
  role: RoomMemberRole;
  bankName: string;
  accountNumber: string;
  profileImageUrl?: string;
};

export type RoomDetail = {
  roomId: number;
  groupId: number;
  groupName: string;
  roomName: string;
  status: RoomStatus;
  promiseDate: string;
  createdAt: string;
  members: RoomMember[];
};

export type RoomDetailResponse = ApiResponse<RoomDetail>;
