import { meetingRecordPhotosDb, meetingRecordsDb, roomsDb, settlementsDb } from '@/mocks/db';

const WON_FORMATTER = new Intl.NumberFormat('ko-KR');
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

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
};

const formatWon = (amount: number) => `₩ ${WON_FORMATTER.format(amount)}`;

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

const getMeetDetailRoom = () => {
  const room = roomsDb.find((room) => {
    const hasSettlement = settlementsDb.some((settlement) => settlement.roomId === room.roomId);
    const hasRecord = meetingRecordsDb.some((record) => record.roomId === room.roomId);
    return hasSettlement && hasRecord;
  });

  if (!room) {
    throw new Error('MeetDetail mock room data is missing.');
  }

  return room;
};

const meetRoom = getMeetDetailRoom();
const meetSettlement = settlementsDb.find((settlement) => settlement.roomId === meetRoom.roomId);
const meetRecords = meetingRecordsDb.filter((record) => record.roomId === meetRoom.roomId);

const getSettlementAmountBySeq = (seq: number) =>
  meetSettlement?.memberSettlements.reduce((total, memberSettlement) => {
    const detail = memberSettlement.detail.find((item) => item.seq === seq);

    return total + (detail?.amount ?? 0);
  }, 0) ?? 0;

export const MEET_DETAIL = {
  roomId: meetRoom.roomId,
  title: meetRoom.roomName,
  datetime: formatMeetDate(meetRoom.promiseDate),
  perPersonCost: formatWon(
    Math.round((meetSettlement?.totalCost ?? 0) / meetRoom.members.length),
  ),
};

export const MEET_DETAIL_PHOTOS = meetingRecordPhotosDb.filter(
  (photo) => photo.roomId === meetRoom.roomId,
);

export const SETTLEMENT_ROUNDS: SettlementRound[] = [
  ...meetRecords.map((record) => {
    const menu = record.menuItems
      .map(({ menuName, count }) => `${menuName} ${count}`)
      .join(', ');

    return {
      id: record.recordId,
      seq: record.seq,
      placeName: record.placeName,
      address: record.address,
      menu,
      totalCost: formatWon(getSettlementAmountBySeq(record.seq)),
      payer: record.payer
        ? `${record.payer.nickname}(${record.payer.bankName ?? '-'} : ${record.payer.accountNumber ?? '-'})`
        : '-',
      participants: record.participants.map((participant) => participant.nickname).join(', '),
      memo: record.memo || '-',
    };
  }),
];
