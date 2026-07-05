export type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

export type RoomStatus = 'VOTING' | 'RECORDING' | 'COMPLETED';

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
  currentStep?: number;
  promiseDate: string;
  createdAt: string;
  members: RoomMember[];
};

export type RoomDetailResponse = ApiResponse<RoomDetail>;

export type CreateRoomRequest = {
  roomName: string;
};

export type RoomCreateData = {
  roomId: number;
  groupId: number;
  roomName: string;
  status: RoomStatus;
  creatorId: number;
  createdAt: string;
};

export type RoomCreateResponse = ApiResponse<RoomCreateData>;
export type CreateRoomResponse = RoomCreateResponse;

export type UpdateRoomStepRequest = {
  nextStatus: RoomStatus;
};

export type RoomStepData = {
  roomId: number;
  currentStatus: RoomStatus;
  updatedAt: string;
};

export type RoomStepResponse = ApiResponse<RoomStepData>;
export type UpdateRoomStepResponse = RoomStepResponse;

export type GroupRoomSummary = {
  roomId: number;
  roomName: string;
  status: RoomStatus;
  promiseDate: string;
};

export type RoomListResponse = ApiResponse<{
  rooms: GroupRoomSummary[];
}>;
export type GroupRoomsResponse = RoomListResponse;

export type RoomStatusMember = {
  userId: number;
  nickname: string;
  role: 'LEADER' | 'MEMBER';
};

export type RoomStatusData = {
  roomId: number;
  roomName: string;
  status: RoomStatus;
  currentStep: number;
  members: RoomStatusMember[];
};

export type RoomStatusResponse = ApiResponse<RoomStatusData>;

export type RoomCloseData = {
  roomId: number;
  status: RoomStatus;
  deletedAt: string;
};

export type RoomCloseResponse = ApiResponse<RoomCloseData>;
export type DeleteRoomResponse = RoomCloseResponse;
