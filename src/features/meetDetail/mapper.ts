import type { SettlementResponse } from '@/features/settlement/types/settlement';
import type {
  ConfirmedScheduleResponse,
  MeetDetailData,
  MeetingRecordPayer,
  MeetingRecordResponse,
  RoomStatusResponse,
  SettlementRound,
} from '@/features/meetDetail/types';

const WON_FORMATTER = new Intl.NumberFormat('ko-KR');
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function toMeetDetailData(
  room: RoomStatusResponse,
  records: MeetingRecordResponse[],
  photos: { photoId: number; s3Url: string; createdAt: string }[],
  settlement: SettlementResponse | null,
  confirmedSchedule: ConfirmedScheduleResponse | null,
): MeetDetailData {
  const totalCost =
    settlement?.totalCost ?? records.reduce((total, record) => total + record.totalCost, 0);
  const memberCount = Math.max(room.members.length, 1);

  return {
    summary: {
      roomId: room.roomId,
      title: room.roomName,
      datetime: formatMeetDate(resolveMeetDate(records, confirmedSchedule)),
      perPersonCost: formatWon(Math.round(totalCost / memberCount)),
    },
    photos: photos.slice().sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
    rounds: records
      .slice()
      .sort((a, b) => a.seq - b.seq)
      .map((record) => toSettlementRound(record, settlement)),
  };
}

function toSettlementRound(
  record: MeetingRecordResponse,
  settlement: SettlementResponse | null,
): SettlementRound {
  const settlementAmount = settlement?.memberSettlements.reduce((total, memberSettlement) => {
    const detail = memberSettlement.detail.find((item) => item.seq === record.seq);
    return total + (detail?.amount ?? 0);
  }, 0);

  return {
    id: record.recordId,
    seq: record.seq,
    placeName: record.placeName,
    address: '-',
    menu: '-',
    totalCost: formatWon(settlementAmount ?? record.totalCost),
    payer: formatPayer(record.payer),
    participants: record.participants.map((participant) => participant.nickname).join(', ') || '-',
    memo: record.memo?.trim() || '-',
  };
}

function resolveMeetDate(
  records: MeetingRecordResponse[],
  confirmedSchedule: ConfirmedScheduleResponse | null,
) {
  if (confirmedSchedule) {
    return `${confirmedSchedule.date}T${confirmedSchedule.time}`;
  }

  return records[0]?.createdAt ?? null;
}

function formatMeetDate(dateString: string | null) {
  if (!dateString) return '일정 미정';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '일정 미정';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours < 12 ? 'am' : 'pm';
  const displayHours = hours % 12 || 12;

  return `${year}. ${month}. ${day} (${WEEKDAYS[date.getDay()]}) ${displayHours}:${minutes} ${meridiem}`;
}

function formatWon(amount: number) {
  return `₩ ${WON_FORMATTER.format(amount)}`;
}

function formatPayer(payer: MeetingRecordPayer | null) {
  if (!payer) return '-';
  if (!payer.bankName || !payer.accountNumber) return payer.nickname;
  return `${payer.nickname}(${payer.bankName} : ${payer.accountNumber})`;
}
