export type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

export type SettlementPayer = {
  roomMemberId: number;
  nickname: string;
  bankName: string;
  accountNumber: string;
};

export type SettlementParticipant = {
  roomMemberId: number;
  nickname: string;
  amount: number;
};

export type SettlementRoundDetail = {
  seq: number;
  placeName: string;
  totalCost: number;
  payer: SettlementPayer | null;
  participants: SettlementParticipant[];
};

export type SettlementDetail = Record<string, SettlementRoundDetail>;

export type SettlementData = {
  isConfirmed: boolean;
  detail: SettlementDetail;
};

export type SettlementResponse = ApiResponse<SettlementData>;

export type SettlementMutationResponse = ApiResponse<Record<string, never>>;
