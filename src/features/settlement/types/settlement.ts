export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface SettlementPayerResponse {
  roomMemberId: number;
  nickname: string;
  bankName: string;
  accountNumber: string;
}

export interface SettlementDetailResponse {
  seq: number;
  placeName: string;
  amount: number;
  payer: SettlementPayerResponse;
  createdAt?: string;
}

export interface SettlementMemberResponse {
  roomMemberId: number;
  nickname: string;
  totalAmount: number;
  detail: SettlementDetailResponse[];
}

export interface SettlementResponse {
  settlementId: number;
  totalCost: number;
  isConfirmed: boolean;
  confirmedAt: string | null;
  memberSettlements: SettlementMemberResponse[];
}

export interface SplitRequest {
  totalAmount: number;
  members: string[];
}

export interface SplitResponse {
  totalAmount: number;
  memberCount: number;
  splits: {
    name: string;
    amount: number;
  }[];
}
