import type { SettlementResponse } from '@/features/settlement/types/settlement';
import type {
  ConfirmedScheduleResponse,
  MeetingRecordListResponse,
  RoomStatusResponse,
} from '@/features/meetDetail/types';
import type {
  SummaryCardResponse,
  SummaryMemberTotalResponse,
} from '@/pages/MogCard/types';

type BuildMogCardSummaryParams = {
  roomId: number;
  room: RoomStatusResponse;
  recordsResponse: MeetingRecordListResponse;
  settlement: SettlementResponse | null;
  confirmedSchedule: ConfirmedScheduleResponse | null;
  previousSummary?: SummaryCardResponse;
};

type FallbackRecord = SummaryCardResponse['records'][number];

export function canRenderMogCard(summary: SummaryCardResponse) {
  return Boolean(summary.confirmedDate) && summary.records.length > 0;
}

export function buildMogCardSummary({
  roomId,
  room,
  recordsResponse,
  settlement,
  confirmedSchedule,
  previousSummary,
}: BuildMogCardSummaryParams): SummaryCardResponse {
  const confirmedDate = confirmedSchedule
    ? `${confirmedSchedule.date}T${confirmedSchedule.time}`
    : (previousSummary?.confirmedDate ?? null);
  const fallbackRecords: FallbackRecord[] = recordsResponse.records.map((record) => ({
    seq: record.seq,
    place: record.place,
    memo: record.memo,
    totalCost: record.totalCost,
    participants: record.participants,
    menuItems: record.menuItems.map((item) => ({
      ...item,
      totalPrice: item.totalPrice ?? item.price * item.quantity,
    })),
  }));

  return {
    roomId,
    groupName: previousSummary?.groupName ?? null,
    roomName: room.roomName ?? previousSummary?.roomName ?? null,
    confirmedDate,
    confirmedPlace: previousSummary?.confirmedPlace ?? null,
    totalMemberCount: room.members.length,
    members: room.members.map(({ nickname }) => nickname),
    photos: recordsResponse.photos.map(({ s3Url }) => s3Url),
    records: fallbackRecords,
    settlement: {
      totalCost: settlement?.totalCost ?? getRecordsTotalCost(fallbackRecords),
      memberTotals:
        settlement?.memberSettlements.map(({ nickname, totalAmount }) => ({
          nickname,
          totalAmount,
        })) ?? getMemberTotalsFromRecords(fallbackRecords),
    },
    cardImageUrl: previousSummary?.cardImageUrl ?? null,
  };
}

function getRecordsTotalCost(records: FallbackRecord[]) {
  return records.reduce((total, record) => total + record.totalCost, 0);
}

function getMemberTotalsFromRecords(records: FallbackRecord[]): SummaryMemberTotalResponse[] {
  const totals = new Map<string, number>();

  records.forEach((record) => {
    record.participants.forEach(({ nickname, amount }) => {
      totals.set(nickname, (totals.get(nickname) ?? 0) + amount);
    });
  });

  return [...totals].map(([nickname, totalAmount]) => ({ nickname, totalAmount }));
}
