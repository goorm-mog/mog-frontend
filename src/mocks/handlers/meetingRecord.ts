import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  RoomStatusApiResponse,
  RoomStatus,
} from '@/features/meetDetail/types';

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
          roomMemberId: member.roomMemberId,
          userId: member.userId,
          nickname: member.nickname,
          bankName: member.bankName,
          accountNumber: member.accountNumber,
          isJoined: true,
        })),
      },
    };

    return HttpResponse.json(response);
  }),

];
