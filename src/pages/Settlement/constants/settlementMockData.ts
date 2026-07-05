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

const room = roomsDb[0];
const settlement = settlementsDb[0];
const group = groupsDb.find(({ groupId }) => groupId === room.groupId);
const records = meetingRecordsDb;
const currentRoomMember = room.members.find(
  ({ userId }) => userId === currentUser.userId,
);
const settlementRounds = Object.values(settlement.data.detail);
const totalCost = settlementRounds.reduce((total, round) => total + round.totalCost, 0);

const memberBurdenById = settlementRounds.reduce<
  Record<number, SettlementMemberBurden>
>((acc, round) => {
  round.participants.forEach((participant) => {
    const roomMember = room.members.find(
      ({ roomMemberId }) => roomMemberId === participant.roomMemberId,
    );

    acc[participant.roomMemberId] ??= {
      id: participant.roomMemberId,
      name: participant.nickname,
      bankText: roomMember?.bankName ?? '은행',
      accountText: roomMember?.accountNumber ?? '-',
      details: [],
    };

    acc[participant.roomMemberId].details.push({
      id: `${participant.roomMemberId}-${round.seq}`,
      placeName: round.placeName,
      amount: participant.amount,
    });
  });

  return acc;
}, {});

export const SETTLEMENT_PLACE_PAYERS: SettlementPlacePayer[] = records.map((record) => ({
  placeName: record.placeName,
  payerId: record.payer?.roomMemberId ?? 0,
  payerName: record.payer?.nickname ?? '-',
}));

export const SETTLEMENT_SUMMARY: SettlementSummary = {
  groupName: group?.groupName ?? '그룹 이름',
  roomName: room.roomName,
  datetime: formatMeetDate(room.promiseDate),
  statusText: settlement.data.isConfirmed ? '정산 완료' : '정산 대기',
  totalCost,
  totalCostText: formatWon(totalCost),
  perPersonCostText: formatWon(Math.round(totalCost / room.members.length)),
  receiptCount: records.length,
  memberCount: room.members.length,
  currentRoomMemberId: currentRoomMember?.roomMemberId,
};

export const SETTLEMENT_MEMBERS: SettlementMemberBurden[] =
  Object.values(memberBurdenById)
    .sort((leftMember, rightMember) => {
      if (leftMember.id === currentRoomMember?.roomMemberId) return -1;
      if (rightMember.id === currentRoomMember?.roomMemberId) return 1;

      return 0;
    });
