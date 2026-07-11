export type MogReceiptItem = {
  name: string;
  amount: string;
};

export type MogReceiptPlace = {
  id: number;
  placeName: string;
  address: string;
  totalCost: string;
  items: MogReceiptItem[];
};

export type MogReceipt = {
  title: string;
  downloadFileName: string;
  participantCount: number;
  participants: string;
  datetime: string;
  places: MogReceiptPlace[];
  totalCost: string;
  photoCount: number;
  representativePhotoUrl?: string;
  barcodeValue: string;
  footer: string;
};

export type SummaryParticipantResponse = {
  nickname: string;
  amount: number;
};

export type SummaryRecordItemResponse = {
  name: string;
  amount: number;
};

export type SummaryRecordPlaceResponse = {
  name?: string;
  placeName?: string;
  address: string | null;
};

export type SummaryRecordMenuItemResponse = {
  id?: number;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

export type SummaryRecordResponse = {
  seq: number;
  place?: SummaryRecordPlaceResponse;
  placeName?: string;
  address?: string | null;
  memo: string | null;
  totalCost: number;
  items?: SummaryRecordItemResponse[];
  menuItems?: SummaryRecordMenuItemResponse[];
  participants: SummaryParticipantResponse[];
};

export type SummaryMemberTotalResponse = {
  nickname: string;
  totalAmount: number;
};

export type SummarySettlementResponse = {
  totalCost: number;
  memberTotals: SummaryMemberTotalResponse[];
};

export type SummaryPlaceResponse = {
  placeName: string;
  address: string;
};

export type SummaryCardResponse = {
  roomId: number;
  confirmedDate: string | null;
  confirmedPlace: SummaryPlaceResponse | null;
  totalMemberCount: number;
  members: string[];
  photos: string[];
  records: SummaryRecordResponse[];
  settlement: SummarySettlementResponse | null;
  cardImageUrl: string | null;
};

export type CardImageResponse = {
  cardImageUrl: string;
};
