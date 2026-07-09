import { currentUser, groupsDb, meetingRecordsDb, roomsDb, settlementsDb } from '@/mocks/db';
import type {
  SettlementMemberBurden,
  SettlementPlacePayer,
  SettlementSummary,
} from '@/pages/Settlement/types';

const WON_FORMATTER = new Intl.NumberFormat('ko-KR');
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const formatWon = (amount: number) => `₩ ${WON_FORMATTER.format(amount)}`;

const formatMeetDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours < 12 ? 'am' : 'pm';
  const displayHours = hours % 12 || 12;

  return `${month}. ${day} (${WEEKDAYS[date.getDay()]}) ${displayHours}:${minutes} ${meridiem}`;
};

const getSettlementRoom = () => {
  const room = roomsDb.find((item) => {
    const hasSettlement = settlementsDb.some((settlement) => settlement.roomId === item.roomId);
    const hasRecord = meetingRecordsDb.some((record) => record.roomId === item.roomId);
    return hasSettlement && hasRecord;
  });

  if (!room) {
    throw new Error('Settlement mock room data is missing.');
  }

  return room;
};

const room = getSettlementRoom();
const settlement = settlementsDb.find((item) => item.roomId === room.roomId);

if (!settlement) {
  throw new Error('Settlement mock data is missing.');
}
const group = groupsDb.find(({ groupId }) => groupId === room.groupId);
const records = meetingRecordsDb.filter(({ roomId }) => roomId === room.roomId);
const currentRoomMember = room.members.find(
  ({ userId }) => userId === currentUser.userId,
);

export const SETTLEMENT_PLACE_PAYERS: SettlementPlacePayer[] = records.map((record) => ({
  placeName: record.placeName,
  payerId: record.payer?.roomMemberId ?? 0,
  payerName: record.payer?.nickname ?? '-',
}));

export const SETTLEMENT_SUMMARY: SettlementSummary = {
  groupName: group?.groupName ?? '그룹 이름',
  roomName: room.roomName,
  datetime: formatMeetDate(room.promiseDate),
  statusText: settlement.isConfirmed ? '정산 완료' : '정산 대기',
  totalCost: settlement.totalCost,
  totalCostText: formatWon(settlement.totalCost),
  perPersonCostText: formatWon(Math.round(settlement.totalCost / room.members.length)),
  receiptCount: records.length,
  memberCount: room.members.length,
  currentRoomMemberId: currentRoomMember?.roomMemberId,
};

export const SETTLEMENT_MEMBERS: SettlementMemberBurden[] =
  settlement.memberSettlements
    .map((member) => ({
      id: member.roomMemberId,
      name: member.nickname,
      bankText:
        room.members.find(({ roomMemberId }) => roomMemberId === member.roomMemberId)
          ?.bankName ?? '은행',
      accountText:
        room.members.find(({ roomMemberId }) => roomMemberId === member.roomMemberId)
          ?.accountNumber ?? '-',
      details: member.detail.map((detail) => ({
        id: `${member.roomMemberId}-${detail.seq}`,
        placeName: detail.placeName,
        amount: detail.amount,
      })),
    }))
    .sort((leftMember, rightMember) => {
      if (leftMember.id === currentRoomMember?.roomMemberId) return -1;
      if (rightMember.id === currentRoomMember?.roomMemberId) return 1;

      return 0;
    });
