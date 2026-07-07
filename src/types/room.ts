import type { ApiResponse } from '@/types/chat';

export type RoomStatus = 'VOTING' | 'RECORDING' | 'COMPLETED';

export type RoomCreateBody = {
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

export type RoomCreateApiResponse = ApiResponse<RoomCreateData>;
