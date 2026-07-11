import { http, HttpResponse, type HttpHandler } from 'msw';
import { groupsDb } from '@/mocks/db/group';
import { meetingRecordPhotosDb, meetingRecordsDb } from '@/mocks/db/meetingRecord';
import { roomsDb } from '@/mocks/db/room';
import { settlementsDb } from '@/mocks/db/settlement';
import type {
  CardImageResponse,
  SummaryCardResponse,
} from '@/pages/MogCard/types';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const cardImageUrlsByRoomId = new Map<number, string>();

const createResponse = <T>(data: T, message: string) => ({
  status: 0,
  code: 'OK',
  message,
  data,
});

const createErrorResponse = (status: number, code: string, message: string) => ({
  status,
  code,
  message,
  data: null,
});

const createSummaryResponse = (roomId: number): SummaryCardResponse | null => {
  const room = roomsDb.find((item) => item.roomId === roomId);
  const group = groupsDb.find((item) => item.groupId === room?.groupId);
  const settlement = settlementsDb.find((item) => item.roomId === roomId);
  const records = meetingRecordsDb
    .filter((record) => record.roomId === roomId)
    .sort((a, b) => a.seq - b.seq);

  if (!room || !settlement || records.length === 0) {
    return null;
  }

  return {
    roomId,
    groupName: group?.groupName ?? null,
    roomName: room.roomName,
    confirmedDate: room.promiseDate.slice(0, 10),
    confirmedPlace: {
      placeName: records[0].placeName,
      address: records[0].address,
    },
    totalMemberCount: room.members.length,
    members: room.members.map((member) => member.nickname),
    photos: meetingRecordPhotosDb
      .filter((photo) => photo.roomId === roomId)
      .map((photo) => photo.s3Url),
    records: records.map((record) => ({
      seq: record.seq,
      place: {
        name: record.placeName,
        address: record.address,
      },
      memo: record.memo,
      totalCost: record.totalCost,
      menuItems: record.menuItems.map(({ menuName, count, price }, index) => ({
        id: index + 1,
        itemName: menuName,
        quantity: count,
        price,
        totalPrice: count * price,
      })),
      participants: record.participants.map(({ nickname, amount }) => ({
        nickname,
        amount,
      })),
    })),
    settlement: {
      totalCost: settlement.totalCost,
      memberTotals: settlement.memberSettlements.map(({ nickname, totalAmount }) => ({
        nickname,
        totalAmount,
      })),
    },
    cardImageUrl: cardImageUrlsByRoomId.get(roomId) ?? null,
  };
};

export const summaryHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/rooms/:roomId/summary`, ({ params }) => {
    const roomId = Number(params.roomId);
    const summary = createSummaryResponse(roomId);

    if (!summary) {
      return HttpResponse.json(
        createErrorResponse(404, 'ROOM_NOT_FOUND', '요약 카드 데이터를 찾을 수 없습니다.'),
        { status: 404 },
      );
    }

    return HttpResponse.json(createResponse(summary, '요약 카드 데이터를 조회했습니다.'));
  }),

  http.post(`${BASE}/api/v1/rooms/:roomId/summary/card`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File) || image.type !== 'image/png') {
      return HttpResponse.json(
        createErrorResponse(400, 'INVALID_IMAGE', 'png 이미지 파일을 업로드해주세요.'),
        { status: 400 },
      );
    }

    const cardImageUrl = `https://picsum.photos/seed/mog-card-${roomId}/740/1084`;
    cardImageUrlsByRoomId.set(roomId, cardImageUrl);

    return HttpResponse.json(
      createResponse<CardImageResponse>(
        { cardImageUrl },
        '요약 카드 이미지가 저장되었습니다.',
      ),
    );
  }),
];
