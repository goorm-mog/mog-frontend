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

export type RoomInfo = {
  roomId: number;
  roomName: string;
  status: RoomStatus;
  promiseDate: string | null;
};

export type RoomListData = {
  rooms: RoomInfo[];
};

export type RoomListApiResponse = ApiResponse<RoomListData>;

export type RoomSummaryParticipant = {
  nickname: string;
  amount: number;
};

export type RoomSummaryRecordItem = {
  name: string;
  amount: number;
};

export type RoomSummaryRecord = {
  seq: number;
  placeName: string;
  address?: string | null;
  memo: string;
  totalCost: number;
  items?: RoomSummaryRecordItem[];
  participants: RoomSummaryParticipant[];
};

export type RoomSummaryMemberTotal = {
  nickname: string;
  totalAmount: number;
};

export type RoomSummarySettlement = {
  totalCost: number;
  memberTotals: RoomSummaryMemberTotal[];
};

export type RoomSummaryPlace = {
  placeName: string;
  address: string;
};

export type RoomSummary = {
  roomId: number;
  confirmedDate: string | null;
  confirmedPlace: RoomSummaryPlace | null;
  totalMemberCount: number;
  members: string[];
  photos: string[];
  records: RoomSummaryRecord[];
  settlement: RoomSummarySettlement | null;
  cardImageUrl: string | null;
};

export type RoomSummaryApiResponse = ApiResponse<RoomSummary>;
