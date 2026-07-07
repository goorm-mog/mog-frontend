import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  ApiResponse,
  SettlementDetailResponse,
  SettlementMemberResponse,
  SettlementResponse,
  SplitRequest,
  SplitResponse,
} from '@/features/settlement/types/settlement';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const mutableSettlements: Record<number, SettlementResponse> = {};
const settlementNotFoundOnceRoomIds = new Set([45]);

function createApiResponse<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    message,
    data,
  };
}

function createSettlementResponse(roomId: number): SettlementResponse | null {
  const room = mockDb.rooms.find((item) => item.roomId === roomId);
  const records = mockDb.meetingRecords.filter((record) => record.roomId === roomId);

  if (!room || records.length === 0) return null;

  const memberSettlements: SettlementMemberResponse[] = room.members.map((member) => {
    const detail = records.reduce<SettlementDetailResponse[]>((details, record) => {
      const participant = record.participants.find(
        (item) => item.roomMemberId === member.roomMemberId,
      );

      if (!participant) return details;

      details.push({
        seq: record.seq,
        placeName: record.placeName,
        amount: participant.amount,
        payer: record.payer,
        createdAt: record.createdAt,
      });

      return details;
    }, []);

    return {
      roomMemberId: member.roomMemberId,
      nickname: member.nickname,
      totalAmount: detail.reduce((total, item) => total + item.amount, 0),
      detail,
    };
  });

  return {
    settlementId:
      mockDb.settlements.find((item) => item.roomId === roomId)?.settlementId ??
      Date.now(),
    totalCost: records.reduce(
      (total, record) => total + (record.totalPrice ?? record.totalCost),
      0,
    ),
    isConfirmed: false,
    confirmedAt: null,
    memberSettlements,
  };
}

export const settlementHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/rooms/:roomId/settlement`, ({ params }) => {
    const roomId = Number(params.roomId);

    if (settlementNotFoundOnceRoomIds.has(roomId)) {
      settlementNotFoundOnceRoomIds.delete(roomId);

      return HttpResponse.json(
        {
          status: 404,
          code: 'SETTLEMENT_NOT_FOUND',
          message: '정산이 존재하지 않습니다.',
          data: null,
        },
        { status: 404 },
      );
    }

    const settlement = mutableSettlements[roomId] ?? createSettlementResponse(roomId);

    if (!settlement) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'SETTLEMENT_NOT_FOUND',
          message: '정산이 존재하지 않습니다.',
          data: null,
        },
        { status: 404 },
      );
    }

    mutableSettlements[roomId] = settlement;

    return HttpResponse.json(createApiResponse(settlement, '정산 조회 성공'));
  }),

  http.post(`${BASE}/api/v1/rooms/:roomId/settlement`, ({ params }) => {
    const roomId = Number(params.roomId);
    const settlement = createSettlementResponse(roomId);

    if (!settlement) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'NO_RECORDS',
          message: '차수 기록이 없습니다.',
          data: null,
        },
        { status: 404 },
      );
    }

    mutableSettlements[roomId] = settlement;

    return HttpResponse.json(createApiResponse(settlement, '정산 계산 성공'));
  }),

  http.patch(`${BASE}/api/v1/rooms/:roomId/settlement/confirm`, ({ params }) => {
    const roomId = Number(params.roomId);
    const settlement = mutableSettlements[roomId] ?? createSettlementResponse(roomId);

    if (!settlement) {
      return HttpResponse.json(
        {
          status: 404,
          code: 'SETTLEMENT_NOT_FOUND',
          message: '정산이 존재하지 않습니다.',
          data: null,
        },
        { status: 404 },
      );
    }

    if (settlement.isConfirmed) {
      return HttpResponse.json(
        {
          status: 409,
          code: 'ALREADY_CONFIRMED',
          message: '이미 확정된 정산입니다.',
          data: null,
        },
        { status: 409 },
      );
    }

    mutableSettlements[roomId] = {
      ...settlement,
      isConfirmed: true,
      confirmedAt: new Date().toISOString(),
    };

    return HttpResponse.json(
      createApiResponse(mutableSettlements[roomId], '정산 확정 성공'),
    );
  }),

  http.post(`${BASE}/api/v1/settlement/split`, async ({ request }) => {
    const { totalAmount, members } = (await request.json()) as SplitRequest;
    const baseAmount = Math.trunc(totalAmount / members.length);
    const remainder = totalAmount % members.length;
    const splits: SplitResponse['splits'] = members.map((name, index) => ({
      name,
      amount: baseAmount + (index < remainder ? 1 : 0),
    }));

    return HttpResponse.json(
      createApiResponse(
        {
          totalAmount,
          memberCount: members.length,
          splits,
        },
        '1/N 금액 분배 성공',
      ),
    );
  }),
];
