import type {
  MeetingRecord,
  MeetingRecordsResponse,
  RecordParticipant,
  RecordPayer,
  RoomRecordPhoto,
} from '@/types/records';

export type MockMeetingRecord = {
  roomId: number;
  recordId: number;
  seq: number;
  placeName: string;
  address: string;
  memo: string;
  totalCost: number;
  totalPrice: number;
  menuItems: { menuName: string; count: number; price: number }[];
  payer: RecordPayer | null;
  participants: RecordParticipant[];
  photoCount: number;
  createdAt: string;
};

export const meetingRecordPhotosDb: RoomRecordPhoto[] = [
  {
    photoId: 1,
    s3Url: 'https://picsum.photos/seed/mog-room-45-1/360/504',
    createdAt: '2026-06-20T19:10:00.000Z',
  },
  {
    photoId: 2,
    s3Url: 'https://picsum.photos/seed/mog-room-45-2/360/504',
    createdAt: '2026-06-20T20:20:00.000Z',
  },
  {
    photoId: 3,
    s3Url: 'https://picsum.photos/seed/mog-room-45-3/360/504',
    createdAt: '2026-06-20T21:30:00.000Z',
  },
];

export const meetingRecordsDb: MockMeetingRecord[] = [
  {
    roomId: 45,
    recordId: 1,
    seq: 1,
    placeName: '합정 카페 A',
    address: '서울시 마포구 합정동 45',
    memo: '디저트 괜찮았음',
    totalCost: 28000,
    totalPrice: 28000,
    menuItems: [
      { menuName: '김치전', count: 1, price: 14000 },
      { menuName: '어묵탕', count: 1, price: 14000 },
    ],
    payer: {
      roomMemberId: 101,
      nickname: '김구름',
      bankName: '신한은행',
      accountNumber: '110-1234-1234',
    },
    participants: [
      { roomMemberId: 101, nickname: '김구름', amount: 10000 },
      { roomMemberId: 102, nickname: '박구름', amount: 8000 },
      { roomMemberId: 103, nickname: '최구름', amount: 10000 },
    ],
    photoCount: 2,
    createdAt: '2026-06-20T19:30:00.000Z',
  },
  {
    roomId: 45,
    recordId: 2,
    seq: 2,
    placeName: '냥냥 룰루',
    address: '서울시 마포구 서교동 12',
    memo: '분위기 최고',
    totalCost: 52000,
    totalPrice: 52000,
    menuItems: [
      { menuName: '파스타', count: 2, price: 18000 },
      { menuName: '샐러드', count: 1, price: 16000 },
    ],
    payer: {
      roomMemberId: 103,
      nickname: '최구름',
      bankName: '카카오뱅크',
      accountNumber: '3333-1234-5678',
    },
    participants: [
      { roomMemberId: 101, nickname: '김구름', amount: 15000 },
      { roomMemberId: 102, nickname: '박구름', amount: 15000 },
      { roomMemberId: 104, nickname: '이구름', amount: 22000 },
    ],
    photoCount: 1,
    createdAt: '2026-06-20T21:00:00.000Z',
  },
];

export const toMeetingRecordApiData = (record: MockMeetingRecord): MeetingRecord => ({
  recordId: record.recordId,
  seq: record.seq,
  placeName: record.placeName,
  memo: record.memo,
  totalCost: record.totalCost,
  payer: record.payer,
  participants: record.participants,
  createdAt: record.createdAt,
});

export const meetingRecordsResponseDb: MeetingRecordsResponse = {
  status: 0,
  code: 'OK',
  message: '만남 기록 목록 조회 성공',
  data: {
    photos: meetingRecordPhotosDb,
    records: meetingRecordsDb.map(toMeetingRecordApiData),
  },
};
