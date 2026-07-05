import type {
  MeetingRecord,
  MeetingRecordsResponse,
  RoomRecordPhoto,
} from '@/types/records';

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

export const meetingRecordsDb: MeetingRecord[] = [
  {
    recordId: 1,
    seq: 1,
    placeName: '합정 카페 A',
    memo: '디저트 괜찮았음',
    totalCost: 28000,
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
    createdAt: '2026-06-20T19:30:00.000Z',
  },
  {
    recordId: 2,
    seq: 2,
    placeName: '냥냥 룰루',
    memo: '분위기 최고',
    totalCost: 52000,
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
    createdAt: '2026-06-20T21:00:00.000Z',
  },
];

export const meetingRecordsResponseDb: MeetingRecordsResponse = {
  status: 0,
  code: 'OK',
  message: '만남 기록 목록 조회 성공',
  data: {
    photos: meetingRecordPhotosDb,
    records: meetingRecordsDb,
  },
};
