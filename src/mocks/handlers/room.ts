import { http, HttpResponse, type HttpHandler } from 'msw';
import { getMyUserId } from '@/lib/auth-storage';
import type {
  RoomCreateApiResponse,
  RoomInfo,
  RoomListApiResponse,
  RoomSummary,
  RoomSummaryApiResponse,
} from '@/types/room';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

let nextRoomId = 101;

const roomsByGroup: Record<number, RoomInfo[]> = {
  12: [
    { roomId: 45, roomName: '강남역 삼겹살 모임', status: 'COMPLETED', promiseDate: '2026-07-08T18:30:00' },
    { roomId: 46, roomName: '보드게임 카페', status: 'COMPLETED', promiseDate: '2026-07-03T14:00:00' },
    { roomId: 47, roomName: '한강 피크닉', status: 'VOTING', promiseDate: '2026-07-15T11:00:00' },
  ],
  13: [
    { roomId: 60, roomName: 'Q3 브랜드 워크샵', status: 'VOTING', promiseDate: '2026-07-20T10:00:00' },
  ],
  14: [
    { roomId: 70, roomName: '여름 가족 여행', status: 'COMPLETED', promiseDate: '2026-07-10T09:00:00' },
  ],
};

const summaryByRoom: Record<number, RoomSummary> = {
  45: {
    roomId: 45,
    confirmedDate: '2026-07-08T18:30:00',
    confirmedPlace: '강남역 8번 출구 삼겹살집',
    totalMemberCount: 4,
    members: ['김구름', '박구름', '최구름', '이구름'],
    photos: [],
    records: [],
    settlement: { totalCost: 128000, memberTotals: [] },
    cardImageUrl: null,
  },
  46: {
    roomId: 46,
    confirmedDate: '2026-07-03T14:00:00',
    confirmedPlace: '홍대 보드게임 카페',
    totalMemberCount: 3,
    members: ['김구름', '박구름', '최구름'],
    photos: [],
    records: [],
    settlement: { totalCost: 45000, memberTotals: [] },
    cardImageUrl: null,
  },
  70: {
    roomId: 70,
    confirmedDate: '2026-07-10T09:00:00',
    confirmedPlace: '강릉 경포대 펜션',
    totalMemberCount: 3,
    members: ['김구름', '엄마구름', '아빠구름'],
    photos: [],
    records: [],
    settlement: { totalCost: 320000, memberTotals: [] },
    cardImageUrl: null,
  },
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
    const summary = summaryByRoom[roomId];

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
];
