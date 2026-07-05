import { meetingRecordPhotosDb, meetingRecordsDb, roomsDb, settlementsDb } from '@/mocks/db';

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

export type SettlementRound = {
  id: number;
  seq: number;
  placeName: string;
  address: string;
  menu: string;
  totalCost: string;
  payer: string;
  participants: string;
  memo: string;
  photoUrls?: string[];
  imageCount: number;
};

const formatWon = (amount: number) => `₩ ${WON_FORMATTER.format(amount)}`;
const formatPayer = (payer: (typeof meetingRecordsDb)[number]['payer']) =>
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

const getSettlementRoundBySeq = (seq: number) =>
  settlementsDb[0]?.data.detail[String(seq)];

const meetRoom = roomsDb[0];
const meetSettlement = settlementsDb[0];
const settlementRounds = Object.values(meetSettlement.data.detail);
const totalCost = settlementRounds.reduce((total, round) => total + round.totalCost, 0);

export const MEET_DETAIL = {
  roomId: meetRoom.roomId,
  title: meetRoom.roomName,
  datetime: formatMeetDate(meetRoom.promiseDate),
  perPersonCost: formatWon(Math.round(totalCost / meetRoom.members.length)),
};

export const SETTLEMENT_ROUNDS: SettlementRound[] = [
  ...meetingRecordsDb.map((record) => {
    const placeMeta = PLACE_META_BY_SEQ[record.seq as keyof typeof PLACE_META_BY_SEQ];
    const settlementRound = getSettlementRoundBySeq(record.seq);
    const menu = record.participants
      .map(({ nickname, amount }) => `${nickname} ${formatWon(amount)}`)
      .join(', ');
    const photoUrls = meetingRecordPhotosDb
      .filter((_, index) => index % meetingRecordsDb.length === record.seq - 1)
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
  }),
];
