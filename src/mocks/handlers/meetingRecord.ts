import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  MeetingRecordListApiResponse,
  RoomStatusApiResponse,
  RoomStatus,
} from '@/types/meetDetail';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function normalizeRoomStatus(status: string): RoomStatus {
  if (status === 'PROCEEDING') return 'RECORDING';
  if (status === 'VOTING' || status === 'RECORDING' || status === 'COMPLETED') return status;
  return 'RECORDING';
}

export const meetingRecordHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/groups/rooms/:roomId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const room = mockDb.rooms.find((item) => item.roomId === roomId);

    if (!room) {
      return HttpResponse.json({ message: '방 정보가 없습니다.' }, { status: 404 });
    }

    const response: RoomStatusApiResponse = {
      status: 200,
      code: 'ROOM_STATUS_FETCH_SUCCESS',
      message: '방 상태 및 멤버 현황을 성공적으로 조회했습니다.',
      data: {
        roomId,
        roomName: room.roomName,
        status: normalizeRoomStatus(room.status),
        currentStep: mockDb.meetingRecords.filter((record) => record.roomId === roomId).length,
        members: room.members.map((member) => ({
          userId: member.userId,
          nickname: member.nickname,
          isJoined: true,
        })),
      },
    };

    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/api/v1/rooms/:roomId/records`, ({ params }) => {
    const roomId = Number(params.roomId);
    const records = mockDb.meetingRecords.filter((record) => record.roomId === roomId);

    const response: MeetingRecordListApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '만남 기록 목록을 조회했습니다.',
      data: {
        photos: [],
        records: records.map((record) => ({
          recordId: record.recordId,
          seq: record.seq,
          placeName: record.placeName,
          memo: record.memo,
          totalCost: record.totalPrice,
          payer: record.payer,
          participants: record.participants.map((participant) => ({ ...participant })),
          createdAt: record.createdAt,
        })),
      },
    };

    return HttpResponse.json(response);
  }),
];
