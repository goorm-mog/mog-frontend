import { http, HttpResponse, type HttpHandler } from 'msw';
import { getMyUserId } from '@/lib/auth-storage';
import { meetingRecordPhotosDb, meetingRecordsDb, roomsDb, settlementsDb } from '@/mocks/db';
import type {
  RoomCreateApiResponse,
  RoomInfo,
  RoomListApiResponse,
  RoomSummary,
  RoomSummaryApiResponse,
} from '@/types/room';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

let nextRoomId = Math.max(100, ...roomsDb.map(({ roomId }) => roomId)) + 1;

const roomsByGroup: Record<number, RoomInfo[]> = roomsDb.reduce<Record<number, RoomInfo[]>>(
  (acc, room) => {
    acc[room.groupId] ??= [];
    acc[room.groupId].push({
      roomId: room.roomId,
      roomName: room.roomName,
      status: room.status,
      promiseDate: room.promiseDate,
    });
    return acc;
  },
  {},
);

const buildSummary = (roomId: number): RoomSummary | null => {
  const room = roomsDb.find((item) => item.roomId === roomId);
  const settlement = settlementsDb.find((item) => item.roomId === roomId);
  const records = meetingRecordsDb
    .filter((record) => record.roomId === roomId)
    .sort((a, b) => a.seq - b.seq);

  if (!room) {
    return null;
  }

  return {
    roomId,
    confirmedDate: room.promiseDate,
    confirmedPlace: records[0]
      ? {
          placeName: records[0].placeName,
          address: records[0].address,
        }
      : null,
    totalMemberCount: room.members.length,
    members: room.members.map((member) => member.nickname),
    photos: meetingRecordPhotosDb
      .filter((photo) => photo.roomId === roomId)
      .map((photo) => photo.s3Url),
    records: records.map((record) => ({
      seq: record.seq,
      placeName: record.placeName,
      address: record.address,
      memo: record.memo,
      totalCost: record.totalCost,
      items: record.menuItems.map(({ menuName, count, price }) => ({
        name: count > 1 ? `${menuName} x ${count}` : menuName,
        amount: price,
      })),
      participants: record.participants.map(({ nickname, amount }) => ({
        nickname,
        amount,
      })),
    })),
    settlement: settlement
      ? {
          totalCost: settlement.totalCost,
          memberTotals: settlement.memberSettlements.map(({ nickname, totalAmount }) => ({
            nickname,
            totalAmount,
          })),
        }
      : null,
    cardImageUrl: null,
  };
};

export const roomHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/groups/:groupId/rooms`, ({ params }) => {
    const groupId = Number(params.groupId);
    const rooms = roomsByGroup[groupId] ?? [];

    const response: RoomListApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '방 조회 성공',
      data: { rooms: [...rooms] },
    };

    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/api/v1/rooms/:roomId/summary`, ({ params }) => {
    const roomId = Number(params.roomId);
    const summary = buildSummary(roomId);

    if (!summary) {
      return HttpResponse.json({ message: '요약 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    const response: RoomSummaryApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '요약 카드 조회 성공',
      data: summary,
    };

    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/api/v1/groups/:groupId/rooms`, async ({ params, request }) => {
    const groupId = Number(params.groupId);
    const body = (await request.json()) as { roomName: string };
    const roomId = nextRoomId++;

    const created: RoomInfo = {
      roomId,
      roomName: body.roomName,
      status: 'VOTING',
      promiseDate: null,
    };

    roomsByGroup[groupId] = [...(roomsByGroup[groupId] ?? []), created];

    const response: RoomCreateApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '방 생성 성공',
      data: {
        roomId,
        groupId,
        roomName: body.roomName,
        status: 'VOTING',
        creatorId: getMyUserId() ?? 1,
        createdAt: new Date().toISOString(),
      },
    };

    return HttpResponse.json(response);
  }),

  http.delete(`${BASE}/api/v1/groups/rooms/:roomId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const groupId = Object.keys(roomsByGroup).find((key) =>
      roomsByGroup[Number(key)]?.some((room) => room.roomId === roomId),
    );

    if (groupId === undefined) {
      return HttpResponse.json({ message: '약속을 찾을 수 없습니다.' }, { status: 404 });
    }

    roomsByGroup[Number(groupId)] = roomsByGroup[Number(groupId)].filter(
      (room) => room.roomId !== roomId,
    );

    return HttpResponse.json({
      status: 200,
      code: 'ROOM_CLOSE_SUCCESS',
      message: '약속 방이 삭제되었습니다.',
      data: { roomId },
    });
  }),
];
