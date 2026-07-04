import { http, HttpResponse, type HttpHandler } from 'msw';
import { meetingRecordsDb } from '@/mocks/db/meetingRecord';
import { settlementsDb } from '@/mocks/db/settlement';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  SettlementData,
  SettlementDetail,
  SettlementMutationResponse,
  SettlementResponse,
} from '@/types/settlement';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const settlementsByRoomId: Record<number, SettlementData> = settlementsDb.reduce(
  (acc, settlement) => {
    acc[settlement.roomId] = {
      isConfirmed: settlement.data.isConfirmed,
      detail: structuredClone(settlement.data.detail),
    };
    return acc;
  },
  {} as Record<number, SettlementData>,
);

const createResponse = <T>(data: T, message: string) => ({
  status: 0,
  code: 'OK',
  message,
  data,
});

const createErrorResponse = (status: number, code: string, message: string) =>
  HttpResponse.json({ status, code, message, data: {} }, { status });

const calculateSettlementDetail = (roomId: number): SettlementDetail => {
  const records = meetingRecordsDb
    .filter((record) =>
      mockDb.roomMembers.some(
        (member) => member.roomId === roomId && member.roomMemberId === record.payer?.roomMemberId,
      ),
    )
    .sort((a, b) => a.seq - b.seq);

  if (records.length === 0) {
    return {};
  }

  return records.reduce<SettlementDetail>((detail, record) => {
    detail[String(record.seq)] = {
      seq: record.seq,
      placeName: record.placeName,
      totalCost: record.totalCost,
      payer: record.payer ? { ...record.payer } : null,
      participants: record.participants.map((participant) => ({ ...participant })),
    };

    return detail;
  }, {});
};

export const settlementHandlers: HttpHandler[] = [
  http.get(`${BASE}/rooms/:roomId/settlement`, ({ params }) => {
    const roomId = Number(params.roomId);
    const settlement = settlementsByRoomId[roomId];

    if (!settlement) {
      return createErrorResponse(404, 'SETTLEMENT_NOT_FOUND', '정산이 존재하지 않습니다.');
    }

    const response: SettlementResponse = createResponse(
      {
        isConfirmed: settlement.isConfirmed,
        detail: structuredClone(settlement.detail),
      },
      '정산 조회 성공',
    );

    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/rooms/:roomId/settlement`, ({ params }) => {
    const roomId = Number(params.roomId);
    const detail = calculateSettlementDetail(roomId);

    if (Object.keys(detail).length === 0) {
      return createErrorResponse(400, 'NO_RECORDS', '차수 기록이 없습니다.');
    }

    settlementsByRoomId[roomId] = {
      isConfirmed: false,
      detail,
    };

    const response: SettlementMutationResponse = createResponse({}, '정산 계산 성공');

    return HttpResponse.json(response);
  }),

  http.patch(`${BASE}/rooms/:roomId/settlement/confirm`, ({ params }) => {
    const roomId = Number(params.roomId);
    const settlement = settlementsByRoomId[roomId];
    const currentMember = mockDb.roomMembers.find(
      (member) => member.roomId === roomId && member.userId === mockDb.auth.currentUser.userId,
    );

    if (currentMember?.role !== 'HOST') {
      return createErrorResponse(403, 'NOT_HOST', '방장만 정산을 확정할 수 있습니다.');
    }

    if (!settlement) {
      return createErrorResponse(404, 'SETTLEMENT_NOT_FOUND', '정산이 존재하지 않습니다.');
    }

    if (settlement.isConfirmed) {
      return createErrorResponse(400, 'ALREADY_CONFIRMED', '이미 확정된 정산입니다.');
    }

    settlement.isConfirmed = true;

    const response: SettlementMutationResponse = createResponse({}, '정산 확정 성공');

    return HttpResponse.json(response);
  }),
];
