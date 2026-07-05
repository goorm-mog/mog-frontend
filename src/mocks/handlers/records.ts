import { http, HttpResponse, type HttpHandler } from 'msw';
import { meetingRecordsResponseDb } from '@/mocks/db/meetingRecord';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  CreateMeetingRecordRequest,
  DeleteRoomPhotoResponse,
  MeetingRecord,
  MeetingRecordResponse,
  MeetingRecordsData,
  MeetingRecordsResponse,
  OcrResponse,
  RecordParticipant,
  RecordPayer,
  RoomRecordPhoto,
  UpdateMeetingRecordRequest,
  UploadRoomPhotoResponse,
  UpsertRecordPayerRequest,
  UpsertRecordParticipantRequest,
} from '@/types/records';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const MAX_ROOM_PHOTO_COUNT = 3;
const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

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
let nextPhotoId =
  Math.max(0, ...meetingRecordsResponseDb.data.photos.map(({ photoId }) => photoId)) + 1;

const createResponse = <T>(data: T, message: string) => ({
  status: 0,
  code: 'OK',
  message,
  data,
});

const createErrorResponse = (status: number, message: string) => ({
  status,
  code: 'BAD_REQUEST',
  message,
  data: null,
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
  http.post(`${BASE}/rooms/:roomId/photos`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const roomData = getRoomData(roomId);

    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return HttpResponse.json(
        createErrorResponse(400, 'multipart/form-data 형식으로 요청해주세요.'),
        { status: 400 },
      );
    }

    if (roomData.photos.length >= MAX_ROOM_PHOTO_COUNT) {
      return HttpResponse.json(createErrorResponse(400, '사진은 최대 3장까지 등록할 수 있습니다.'), {
        status: 400,
      });
    }

    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return HttpResponse.json(createErrorResponse(400, 'image 파일을 첨부해주세요.'), {
        status: 400,
      });
    }

    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
      return HttpResponse.json(
        createErrorResponse(400, 'jpeg, png, webp 형식의 이미지만 업로드할 수 있습니다.'),
        { status: 400 },
      );
    }

    if (image.size > MAX_IMAGE_FILE_SIZE) {
      return HttpResponse.json(
        createErrorResponse(400, '이미지 파일은 최대 10MB까지 업로드할 수 있습니다.'),
        { status: 400 },
      );
    }

    const photo: RoomRecordPhoto = {
      photoId: nextPhotoId,
      s3Url: `https://picsum.photos/seed/mog-room-${roomId}-${nextPhotoId}/360/504`,
      createdAt: new Date().toISOString(),
    };

    nextPhotoId += 1;
    roomData.photos.push(photo);

    const response: UploadRoomPhotoResponse = createResponse(photo, '사진 업로드 성공');

    return HttpResponse.json(response);
  }),

  http.delete(`${BASE}/rooms/:roomId/photos/:photoId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const photoId = Number(params.photoId);
    const roomData = getRoomData(roomId);
    const nextPhotos = roomData.photos.filter((photo) => photo.photoId !== photoId);

    if (nextPhotos.length === roomData.photos.length) {
      return HttpResponse.json({ message: '사진 정보가 없습니다.' }, { status: 404 });
    }

    roomData.photos = nextPhotos;

    const response: DeleteRoomPhotoResponse = createResponse(
      '삭제되었습니다.',
      '사진 삭제 성공',
    );

    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/rooms/:roomId/records/ocr`, async ({ request }) => {
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return HttpResponse.json(
        createErrorResponse(400, 'multipart/form-data 형식으로 요청해주세요.'),
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return HttpResponse.json(createErrorResponse(400, 'image 파일을 첨부해주세요.'), {
        status: 400,
      });
    }

    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
      return HttpResponse.json(
        createErrorResponse(400, 'jpg, jpeg, png, gif, webp 형식의 이미지만 업로드할 수 있습니다.'),
        { status: 400 },
      );
    }

    if (image.size > MAX_IMAGE_FILE_SIZE) {
      return HttpResponse.json(
        createErrorResponse(400, '이미지 파일은 최대 10MB까지 업로드할 수 있습니다.'),
        { status: 400 },
      );
    }

    const response: OcrResponse = createResponse(
      {
        storeName: '합정 카페 A',
        totalAmount: 28000,
        items: [
          { name: '김치전', count: 1, price: 14000 },
          { name: '어묵탕', count: null, price: 14000 },
        ],
      },
      '영수증 OCR 분석 성공',
    );

    return HttpResponse.json(response);
  }),

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
