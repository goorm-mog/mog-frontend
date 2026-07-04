export type SettlementMemberDetail = {
  id: string;
  placeName: string;
  amount: number;
};

export type SettlementMemberBurden = {
  id: number;
  name: string;
  bankText: string;
  accountText: string;
  details: SettlementMemberDetail[];
};

export type PlaceParticipant = {
  memberId: number;
  name: string;
  amount: number;
};

export type PlaceSettlement = {
  id: string;
  placeName: string;
  payerId: number | null;
  payerName: string;
  targetAmount: number;
  included: boolean;
  participants: PlaceParticipant[];
};

export type SettlementTransfer = {
  id: string;
  transferKey: string;
  from: string;
  to: string;
  amount: number;
  bankText: string;
  accountText: string;
  direction: 'send' | 'receive';
  breakdown: {
    placeName: string;
    direction: 'send' | 'receive';
    amount: number;
  }[];
};

export type SettlementTransferRow = {
  transfer: SettlementTransfer;
  originalAmount: number;
  amountDelta: number;
  isRemoved: boolean;
};
