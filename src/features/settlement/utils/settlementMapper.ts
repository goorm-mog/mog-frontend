import type { SettlementResponse } from '@/features/settlement/types/settlement';
import type {
  SettlementMemberBurden,
  SettlementPlacePayer,
} from '@/pages/Settlement/types';

const DEFAULT_BANK_TEXT = '은행';
const DEFAULT_ACCOUNT_TEXT = '-';

export function mapSettlementToMemberBurdens(
  settlement: SettlementResponse,
  currentRoomMemberId?: number,
): SettlementMemberBurden[] {
  const payerByMemberId = new Map(
    settlement.memberSettlements
      .flatMap((member) => member.detail.map((detail) => detail.payer))
      .map((payer) => [payer.roomMemberId, payer]),
  );

  return settlement.memberSettlements
    .map((member) => {
      const payer = payerByMemberId.get(member.roomMemberId);

      return {
        id: member.roomMemberId,
        name: member.nickname,
        bankText: payer?.bankName ?? DEFAULT_BANK_TEXT,
        accountText: payer?.accountNumber ?? DEFAULT_ACCOUNT_TEXT,
        details: member.detail.map((detail) => ({
          id: `${member.roomMemberId}-${detail.seq}`,
          placeName: detail.placeName,
          amount: detail.amount,
        })),
      };
    })
    .sort((leftMember, rightMember) => {
      if (leftMember.id === currentRoomMemberId) return -1;
      if (rightMember.id === currentRoomMemberId) return 1;

      return 0;
    });
}

export function mapSettlementToPlacePayers(
  settlement: SettlementResponse,
): SettlementPlacePayer[] {
  const payerByPlaceName = new Map<string, SettlementPlacePayer>();

  for (const member of settlement.memberSettlements) {
    for (const detail of member.detail) {
      if (payerByPlaceName.has(detail.placeName)) continue;

      payerByPlaceName.set(detail.placeName, {
        placeName: detail.placeName,
        payerId: detail.payer.roomMemberId,
        payerName: detail.payer.nickname,
      });
    }
  }

  return Array.from(payerByPlaceName.values());
}
