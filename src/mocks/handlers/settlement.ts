import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import { getMeetingRecordsByRoomId } from '@/mocks/handlers/records';
import type {
  ApiResponse,
  SettlementDetailResponse,
  SettlementMemberResponse,
  SettlementResponse,
  SplitRequest,
  SplitResponse,
} from '@/features/settlement/types/settlement';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const mutableSettlements: Record<
  number,
  {
    recordsSignature: string;
    settlement: SettlementResponse;
  }
> = {};

function createApiResponse<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    message,
    data,
  };
}

function createRecordsSignature(roomId: number) {
  const records = getMeetingRecordsByRoomId(roomId);

  return JSON.stringify(
    records.map((record) => ({
      recordId: record.recordId,
      seq: record.seq,
      placeName: record.place.name,
      totalCost: record.totalCost,
      payerRoomMemberId: record.payer?.roomMemberId ?? null,
      participants: record.participants.map(({ roomMemberId, amount }) => ({
        roomMemberId,
        amount,
      })),
    })),
  );
}

function createSettlementResponse(roomId: number): SettlementResponse | null {
  const room = mockDb.rooms.find((item) => item.roomId === roomId);
  const records = getMeetingRecordsByRoomId(roomId);

  if (!room || records.length === 0) return null;

  const memberSettlements: SettlementMemberResponse[] = room.members.map((member) => {
    const detail = records.reduce<SettlementDetailResponse[]>((details, record) => {
      const participant = record.participants.find(
        (item) => item.roomMemberId === member.roomMemberId,
      );

      if (!participant) return details;

      details.push({
        seq: record.seq,
        placeName: record.place.name,
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
    totalCost: records.reduce((total, record) => total + record.totalCost, 0),
    isConfirmed: false,
    confirmedAt: null,
    memberSettlements,
  };
}

function saveSettlement(roomId: number, settlement: SettlementResponse) {
  mutableSettlements[roomId] = {
    recordsSignature: createRecordsSignature(roomId),
    settlement,
  };
}

export const settlementHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/rooms/:roomId/settlement`, ({ params }) => {
    const roomId = Number(params.roomId);
    const cachedSettlement = mutableSettlements[roomId];
    const recordsSignature = createRecordsSignature(roomId);
    const settlement =
      cachedSettlement?.recordsSignature === recordsSignature
        ? cachedSettlement.settlement
        : createSettlementResponse(roomId);

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

    saveSettlement(roomId, settlement);

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

    saveSettlement(roomId, settlement);

    return HttpResponse.json(createApiResponse(settlement, '정산 계산 성공'));
  }),

  http.patch(`${BASE}/api/v1/rooms/:roomId/settlement/confirm`, ({ params }) => {
    const roomId = Number(params.roomId);
    const cachedSettlement = mutableSettlements[roomId];
    const recordsSignature = createRecordsSignature(roomId);
    const settlement =
      cachedSettlement?.recordsSignature === recordsSignature
        ? cachedSettlement.settlement
        : createSettlementResponse(roomId);

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

    saveSettlement(roomId, {
      ...settlement,
      isConfirmed: true,
      confirmedAt: new Date().toISOString(),
    });

    return HttpResponse.json(
      createApiResponse(mutableSettlements[roomId].settlement, '정산 확정 성공'),
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
