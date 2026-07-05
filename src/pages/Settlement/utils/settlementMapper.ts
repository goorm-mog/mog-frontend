import { getMyUserId } from '@/lib/auth-storage';
import type {
  SettlementMemberBurden,
  SettlementPlacePayer,
  SettlementSummary,
} from '@/pages/Settlement/types';
import type { SettlementData } from '@/types/settlement';
import type { RoomDetail } from '@/types/rooms';

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

export function createSettlementViewModel(room: RoomDetail, settlement: SettlementData) {
  const settlementRounds = Object.values(settlement.detail);
  const totalCost = settlementRounds.reduce((total, round) => total + round.totalCost, 0);
  const myUserId = getMyUserId();
  const currentRoomMember = room.members.find(({ userId }) => userId === myUserId);
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
  const members = Object.values(memberBurdenById).sort((leftMember, rightMember) => {
    if (leftMember.id === currentRoomMember?.roomMemberId) return -1;
    if (rightMember.id === currentRoomMember?.roomMemberId) return 1;

    return 0;
  });
  const placePayers: SettlementPlacePayer[] = settlementRounds.map((round) => ({
    placeName: round.placeName,
    payerId: round.payer?.roomMemberId ?? 0,
    payerName: round.payer?.nickname ?? '-',
  }));
  const summary: SettlementSummary = {
    groupName: room.groupName,
    roomName: room.roomName,
    datetime: formatMeetDate(room.promiseDate),
    statusText: settlement.isConfirmed ? '정산 완료' : '정산 대기',
    totalCost,
    totalCostText: formatWon(totalCost),
    perPersonCostText: formatWon(Math.round(totalCost / Math.max(1, room.members.length))),
    receiptCount: settlementRounds.length,
    memberCount: room.members.length,
    currentRoomMemberId: currentRoomMember?.roomMemberId,
  };

  return {
    summary,
    members,
    placePayers,
  };
}
