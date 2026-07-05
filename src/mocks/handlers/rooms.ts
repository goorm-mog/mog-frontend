import { http, HttpResponse, type HttpHandler } from 'msw';
import { groupsDb } from '@/mocks/db/group';
import { roomsDb } from '@/mocks/db/room';
import type { RoomDetailResponse } from '@/types/rooms';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const createResponse = <T>(data: T, message: string) => ({
  status: 0,
  code: 'OK',
  message,
  data,
});

export const roomHandlers: HttpHandler[] = [
  http.get(`${BASE}/rooms/:roomId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const room = roomsDb.find((item) => item.roomId === roomId);

    if (!room) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'ROOM_NOT_FOUND',
          message: '방 정보를 찾을 수 없습니다.',
          data: null,
        },
        { status: 404 },
      );
    }

    const group = groupsDb.find((item) => item.groupId === room.groupId);
    const response: RoomDetailResponse = createResponse(
      {
        roomId: room.roomId,
        groupId: room.groupId,
        groupName: group?.groupName ?? '그룹 이름',
        roomName: room.roomName,
        status: room.status,
        promiseDate: room.promiseDate,
        createdAt: room.createdAt,
        members: room.members.map((member) => ({
          ...member,
          profileImageUrl: '',
        })),
      },
      '방 상세 조회 성공',
    );

    return HttpResponse.json(response);
  }),
];
