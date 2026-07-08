export type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

export type RoomRecordPhoto = {
  photoId: number;
  s3Url: string;
  createdAt: string;
};

export type RecordPayer = {
  roomMemberId: number;
  nickname: string;
  bankName: string | null;
  accountNumber: string | null;
};

export type RecordParticipant = {
  roomMemberId: number;
  nickname: string;
  amount: number;
};

export type MeetingRecord = {
  recordId: number;
  seq: number;
  placeName: string;
  memo: string | null;
  totalCost: number;
  payer: RecordPayer | null;
  participants: RecordParticipant[];
  createdAt: string;
};

export type MeetingRecordsData = {
  photos: RoomRecordPhoto[];
  records: MeetingRecord[];
};

export type MeetingRecordsResponse = ApiResponse<MeetingRecordsData>;

export type MeetingRecordResponse = ApiResponse<MeetingRecord>;

export type DeleteMeetingRecordResponse = ApiResponse<string | null | undefined>;

export type RoomPhotoResponse = ApiResponse<RoomRecordPhoto>;

export type DeleteRoomPhotoResponse = ApiResponse<string | null | undefined>;

export type OcrItem = {
  name: string;
  count: number | null;
  price: number;
};

export type OcrData = {
  storeName: string | null;
  totalAmount: number;
  items: OcrItem[];
};

export type OcrResponse = ApiResponse<OcrData>;

export type UpsertRecordPayerRequest = {
  roomMemberId: number;
  bankName: string | null;
  accountNumber: string | null;
};

export type UpsertRecordParticipantRequest = {
  roomMemberId: number;
  amount: number;
};

export type CreateMeetingRecordRequest = {
  placeName: string;
  memo: string;
  payer?: UpsertRecordPayerRequest | null;
  participants: UpsertRecordParticipantRequest[];
};

export type UpdateMeetingRecordRequest = {
  placeName?: string | null;
  memo?: string | null;
  payer?: UpsertRecordPayerRequest | null;
  participants?: UpsertRecordParticipantRequest[] | null;
};
