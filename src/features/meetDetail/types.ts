import type { ApiResponse } from '@/types/chat';

export type RoomStatus = 'VOTING' | 'RECORDING' | 'COMPLETED' | 'PROCEEDING';

export interface RoomStatusResponse {
  roomId: number;
  roomName: string;
  status: RoomStatus;
  currentStep: number;
  members: {
    roomMemberId: number;
    userId: number;
    nickname: string;
    isJoined: boolean;
  }[];
}

export type RoomStatusApiResponse = ApiResponse<RoomStatusResponse>;

export interface ConfirmedScheduleResponse {
  confirmedId: number;
  roomId: number;
  date: string;
  time: string;
  confirmedBy: number;
  kakaoEventId: string | null;
  confirmedAt: string;
}

export interface MeetingRecordPayer {
  roomMemberId: number;
  nickname: string;
  bankName: string | null;
  accountNumber: string | null;
}

export interface MeetingRecordParticipant {
  roomMemberId: number;
  nickname: string;
  amount: number;
}

export interface MeetingRecordMenuItem {
  id?: number;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}

export interface MeetingRecordResponse {
  recordId: number;
  seq: number;
  placeName: string;
  address?: string | null;
  menuItems: MeetingRecordMenuItem[];
  memo: string | null;
  totalCost: number;
  payer: MeetingRecordPayer | null;
  participants: MeetingRecordParticipant[];
  createdAt: string;
}

export interface MeetingRecordListResponse {
  photos: { photoId: number; s3Url: string; createdAt: string }[];
  records: MeetingRecordResponse[];
}

export type MeetingRecordListApiResponse = ApiResponse<MeetingRecordListResponse>;

export type MeetDetailSummary = {
  roomId: number;
  title: string;
  datetime: string;
  perPersonCost: string;
};

export type SettlementRound = {
  id: number;
  seq: number;
  placeName: string;
  address: string;
  menu: string;
  totalCost: string;
  payer: string;
  participants: string;
  memo: string;
};

export type MeetDetailData = {
  summary: MeetDetailSummary;
  photos: { photoId: number; s3Url: string; createdAt: string }[];
  rounds: SettlementRound[];
};
