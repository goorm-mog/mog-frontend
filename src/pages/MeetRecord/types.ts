export type ReceiptItem = {
  name: string;
  count: number;
  price: number;
};

export type ReceiptParticipant = {
  id: number;
  name: string;
  selected?: boolean;
};

export type ReceiptPayerOption = {
  id: number;
  label: string;
  bankName?: string | null;
  accountNumber?: string | null;
};

export type ReceiptCardData = {
  recordId?: number;
  roundLabel: string;
  placeName: string;
  placePlaceholder: string;
  menuPlaceholder: string;
  items: ReceiptItem[];
  totalAmount: number;
  participants: ReceiptParticipant[];
  payerPlaceholder: string;
  payerRoomMemberId?: number | null;
  payerBankName?: string | null;
  payerAccountNumber?: string | null;
  memo: string;
  memoPlaceholder: string;
  photoCount: number;
};

export type PlaceSearchResult = {
  id: number;
  name: string;
  address: string;
};

export type EditableReceiptItem = ReceiptItem & {
  id: string;
};
