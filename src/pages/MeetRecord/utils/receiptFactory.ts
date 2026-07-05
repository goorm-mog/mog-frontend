import { receiptCopy } from '@/pages/MeetRecord/constants/receiptCopy';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import type { RoomMember } from '@/types/rooms';

function getReceiptSeq(receipt: ReceiptCardData) {
  return Number.parseInt(receipt.roundLabel, 10) || 0;
}

export function getNextReceiptSeq(receipts: readonly ReceiptCardData[]) {
  return Math.max(0, ...receipts.map(getReceiptSeq)) + 1;
}

export function createEmptyReceipt(
  seq: number,
  roomMembers: readonly RoomMember[],
): ReceiptCardData {
  return {
    roundLabel: `${seq}차`,
    placeName: '',
    placePlaceholder: receiptCopy.placePlaceholder,
    menuPlaceholder: receiptCopy.menuPlaceholder,
    items: [],
    totalAmount: 0,
    participants: roomMembers.map(({ roomMemberId, nickname }) => ({
      id: roomMemberId,
      name: nickname,
      selected: true,
    })),
    payerPlaceholder: receiptCopy.payerPlaceholder,
    memo: '',
    memoPlaceholder: receiptCopy.memoPlaceholder,
    photoCount: 0,
  };
}
