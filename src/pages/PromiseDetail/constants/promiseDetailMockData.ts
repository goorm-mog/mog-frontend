import { meetingRecordsDb, roomsDb, settlementsDb } from '@/mocks/db';

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

const formatPromiseDate = (dateString: string) => {
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

const getSettlementAmountBySeq = (seq: number) =>
  settlementsDb[0]?.memberSettlements.reduce((total, memberSettlement) => {
    const detail = memberSettlement.detail.find((item) => item.seq === seq);

    return total + (detail?.amount ?? 0);
  }, 0) ?? 0;

const promiseRoom = roomsDb[0];
const promiseSettlement = settlementsDb[0];

export const PROMISE_DETAIL = {
  title: promiseRoom.roomName,
  datetime: formatPromiseDate(promiseRoom.promiseDate),
  perPersonCost: formatWon(
    Math.round(promiseSettlement.totalCost / promiseRoom.members.length),
  ),
};

export const SETTLEMENT_ROUNDS: SettlementRound[] = [
  ...meetingRecordsDb.map((record) => {
    const placeMeta = PLACE_META_BY_SEQ[record.seq as keyof typeof PLACE_META_BY_SEQ];
    const menu = record.menuItems
      .map(({ menuName, count }) => `${menuName} ${count}`)
      .join(', ');

    return {
      id: record.recordId,
      seq: record.seq,
      placeName: record.placeName,
      address: placeMeta?.address ?? '-',
      menu,
      totalCost: formatWon(getSettlementAmountBySeq(record.seq)),
      payer: `${record.payer.nickname} | ${record.payer.bankName} ${record.payer.accountNumber}`,
      participants: record.participants.map((participant) => participant.nickname).join(', '),
      memo: record.memo || '-',
      imageCount: record.photoCount,
    };
  }),
  {
    id: 999,
    seq: 3,
    placeName: '스크롤 확인용 장소',
    address: '서울시 마포구 연남동 33',
    menu: '아메리카노 3, 디저트 2',
    totalCost: formatWon(32000),
    payer: '임시 | 토스뱅크 1000-0000-0000',
    participants: '김구름, 박구름, 최구름',
    memo: '스크롤 확인용 임시 차수입니다.',
    imageCount: 4,
  },
  {
    id: 1000,
    seq: 4,
    placeName: '스크롤 확인용 장소 2',
    address: '서울시 마포구 동교동 21',
    menu: '파스타 2, 샐러드 1, 음료 3',
    totalCost: formatWon(58000),
    payer: '임시2 | 카카오뱅크 3333-00-0000000',
    participants: '김구름, 최구름, 이구름',
    memo: '목록 스크롤 범위 확인을 위한 임시 차수입니다.',
    imageCount: 5,
  },
];
