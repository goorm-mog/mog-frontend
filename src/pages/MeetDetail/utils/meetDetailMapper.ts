import type { MeetDetail, SettlementRound } from '@/pages/MeetDetail/types';
import type { MeetingRecord, MeetingRecordsData } from '@/types/records';
import type { RoomDetail } from '@/types/rooms';
import type { SettlementData } from '@/types/settlement';

const WON_FORMATTER = new Intl.NumberFormat('ko-KR');
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const PLACE_META_BY_SEQ = {
  1: {
    address: '서울시 마포구 합정동 45',
  },
  2: {
    address: '서울시 마포구 서교동 12',
  },
} as const;

const formatWon = (amount: number) => `₩ ${WON_FORMATTER.format(amount)}`;
const formatPayer = (payer: MeetingRecord['payer']) =>
  payer ? `${payer.nickname}(${payer.bankName} : ${payer.accountNumber})` : '-';

const formatMeetDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours < 12 ? 'am' : 'pm';
  const displayHours = hours % 12 || 12;

  return `${year}. ${month}. ${day} (${WEEKDAYS[date.getDay()]}) ${displayHours}:${minutes} ${meridiem}`;
};

export function createMeetDetailViewModel(
  room: RoomDetail,
  recordsData: MeetingRecordsData,
  settlement: SettlementData | null,
) {
  const settlementRounds = Object.values(settlement?.detail ?? {});
  const totalCost =
    settlementRounds.length > 0
      ? settlementRounds.reduce((total, round) => total + round.totalCost, 0)
      : recordsData.records.reduce((total, record) => total + record.totalCost, 0);
  const detail: MeetDetail = {
    roomId: room.roomId,
    title: room.roomName,
    datetime: formatMeetDate(room.promiseDate),
    perPersonCost: formatWon(Math.round(totalCost / Math.max(1, room.members.length))),
  };
  const rounds: SettlementRound[] = recordsData.records.map((record) => {
    const placeMeta = PLACE_META_BY_SEQ[record.seq as keyof typeof PLACE_META_BY_SEQ];
    const settlementRound = settlement?.detail[String(record.seq)];
    const menu = record.participants
      .map(({ nickname, amount }) => `${nickname} ${formatWon(amount)}`)
      .join(', ');
    const photoUrls = recordsData.photos
      .filter((_, index) => index % recordsData.records.length === record.seq - 1)
      .map(({ s3Url }) => s3Url);

    return {
      id: record.recordId,
      seq: record.seq,
      placeName: record.placeName,
      address: placeMeta?.address ?? '-',
      menu,
      totalCost: formatWon(settlementRound?.totalCost ?? record.totalCost),
      payer: formatPayer(record.payer),
      participants: record.participants.map((participant) => participant.nickname).join(', '),
      memo: record.memo || '-',
      photoUrls,
      imageCount: photoUrls.length,
    };
  });

  return {
    detail,
    rounds,
  };
}
