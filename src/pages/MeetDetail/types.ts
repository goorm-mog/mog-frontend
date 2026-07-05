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
  photoUrls?: string[];
  imageCount: number;
};

export type MeetDetail = {
  roomId: number;
  title: string;
  datetime: string;
  perPersonCost: string;
};
