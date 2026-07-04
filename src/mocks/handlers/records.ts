import { http, HttpResponse, type HttpHandler } from 'msw';
import { meetingRecordsResponseDb } from '@/mocks/db/meetingRecord';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  CreateMeetingRecordRequest,
  MeetingRecord,
  MeetingRecordResponse,
  MeetingRecordsData,
  MeetingRecordsResponse,
  RecordParticipant,
  RecordPayer,
  UpdateMeetingRecordRequest,
  UpsertRecordPayerRequest,
  UpsertRecordParticipantRequest,
} from '@/types/records';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const cloneRecord = (record: MeetingRecord): MeetingRecord => ({
  ...record,
  payer: record.payer ? { ...record.payer } : null,
  participants: record.participants.map((participant) => ({ ...participant })),
});

const recordsByRoomId: Record<number, MeetingRecordsData> = {
  45: {
    photos: meetingRecordsResponseDb.data.photos.map((photo) => ({ ...photo })),
    records: meetingRecordsResponseDb.data.records.map(cloneRecord),
  },
};

let nextRecordId =
  Math.max(0, ...meetingRecordsResponseDb.data.records.map(({ recordId }) => recordId)) +
  1;

const createResponse = <T>(data: T, message: string) => ({
  status: 0,
  code: 'OK',
  message,
  data,
});

const getRoomData = (roomId: number) => {
  recordsByRoomId[roomId] ??= {
    photos: [],
    records: [],
  };

  return recordsByRoomId[roomId];
};

const findRoomMember = (roomId: number, roomMemberId: number) =>
  mockDb.roomMembers.find(
    (member) => member.roomId === roomId && member.roomMemberId === roomMemberId,
  );

const mapPayer = (
  roomId: number,
  payer?: UpsertRecordPayerRequest | null,
): RecordPayer | null => {
  if (!payer) {
    return null;
  }

  const member = findRoomMember(roomId, payer.roomMemberId);

  return {
    roomMemberId: payer.roomMemberId,
    nickname: member?.nickname ?? '',
    bankName: payer.bankName,
    accountNumber: payer.accountNumber,
  };
};

const mapParticipants = (
  roomId: number,
  participants: UpsertRecordParticipantRequest[],
): RecordParticipant[] =>
  participants.map(({ roomMemberId, amount }) => {
    const member = findRoomMember(roomId, roomMemberId);

    return {
      roomMemberId,
      nickname: member?.nickname ?? '',
      amount,
    };
  });

const sumParticipantsAmount = (participants: readonly RecordParticipant[]) =>
  participants.reduce((total, participant) => total + participant.amount, 0);

const resequenceRecords = (records: MeetingRecord[]) => {
  records
    .sort((a, b) => a.seq - b.seq)
    .forEach((record, index) => {
      record.seq = index + 1;
    });
};

export const recordsHandlers: HttpHandler[] = [
  http.get(`${BASE}/rooms/:roomId/records`, ({ params }) => {
    const roomId = Number(params.roomId);
    const roomData = getRoomData(roomId);
    const response: MeetingRecordsResponse = createResponse(
      {
        photos: roomData.photos.map((photo) => ({ ...photo })),
        records: roomData.records.map(cloneRecord).sort((a, b) => a.seq - b.seq),
      },
      '만남 기록 목록 조회 성공',
    );

    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/rooms/:roomId/records`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const roomData = getRoomData(roomId);
    const body = (await request.json()) as CreateMeetingRecordRequest;
    const participants = mapParticipants(roomId, body.participants);
    const createdAt = new Date().toISOString();
    const record: MeetingRecord = {
      recordId: nextRecordId,
      seq: Math.max(0, ...roomData.records.map(({ seq }) => seq)) + 1,
      placeName: body.placeName,
      memo: body.memo,
      totalCost: sumParticipantsAmount(participants),
      payer: mapPayer(roomId, body.payer),
      participants,
      createdAt,
    };

    nextRecordId += 1;
    roomData.records.push(record);

    const response: MeetingRecordResponse = createResponse(
      cloneRecord(record),
      '만남 기록 생성 성공',
    );

    return HttpResponse.json(response);
  }),

  http.delete(`${BASE}/rooms/:roomId/records/:recordId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const recordId = Number(params.recordId);
    const roomData = getRoomData(roomId);
    const nextRecords = roomData.records.filter((record) => record.recordId !== recordId);

    if (nextRecords.length === roomData.records.length) {
      return HttpResponse.json({ message: '기록 정보가 없습니다.' }, { status: 404 });
    }

    roomData.records = nextRecords;
    resequenceRecords(roomData.records);

    return HttpResponse.json(createResponse('삭제되었습니다.', '만남 기록 삭제 성공'));
  }),

  http.patch(`${BASE}/rooms/:roomId/records/:recordId`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const recordId = Number(params.recordId);
    const roomData = getRoomData(roomId);
    const record = roomData.records.find((item) => item.recordId === recordId);

    if (!record) {
      return HttpResponse.json({ message: '기록 정보가 없습니다.' }, { status: 404 });
    }

    const body = (await request.json()) as UpdateMeetingRecordRequest;
    const nextParticipants =
      body.participants == null
        ? record.participants
        : mapParticipants(roomId, body.participants);

    record.placeName = body.placeName ?? record.placeName;
    record.memo = body.memo ?? record.memo;
    record.payer = body.payer == null ? record.payer : mapPayer(roomId, body.payer);
    record.participants = nextParticipants;
    record.totalCost = sumParticipantsAmount(nextParticipants);

    const response: MeetingRecordResponse = createResponse(
      cloneRecord(record),
      '만남 기록 수정 성공',
    );

    return HttpResponse.json(response);
  }),
];
