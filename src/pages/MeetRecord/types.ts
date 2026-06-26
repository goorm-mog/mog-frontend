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

export type ReceiptCardData = {
  roundLabel: string;
  placePlaceholder: string;
  menuPlaceholder: string;
  items: ReceiptItem[];
  totalAmount: number;
  participants: ReceiptParticipant[];
  payerPlaceholder: string;
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
