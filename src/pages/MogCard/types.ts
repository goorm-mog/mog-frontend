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
