import { http, HttpResponse, type HttpHandler } from 'msw';
import { getMyUserId } from '@/lib/auth-storage';
import type { RoomCreateApiResponse } from '@/types/room';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

let nextRoomId = 101;

export const roomHandlers: HttpHandler[] = [
  http.post(`${BASE}/api/v1/groups/:groupId/rooms`, async ({ params, request }) => {
    const groupId = Number(params.groupId);
    const body = (await request.json()) as { roomName: string };

    const response: RoomCreateApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '방 생성 성공',
      data: {
        roomId: nextRoomId++,
        groupId,
        roomName: body.roomName,
        status: 'VOTING',
        creatorId: getMyUserId() ?? 1,
        createdAt: new Date().toISOString(),
      },
    };

    return HttpResponse.json(response);
  }),
];
