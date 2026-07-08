import { receiptCopy } from '@/pages/MeetRecord/constants/receiptCopy';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import type { MeetRecordMember } from '@/pages/MeetRecord/utils/meetRecordMapper';

function getReceiptSeq(receipt: ReceiptCardData) {
  return Number.parseInt(receipt.roundLabel, 10) || 0;
}

export function getNextReceiptSeq(receipts: readonly ReceiptCardData[]) {
  return Math.max(0, ...receipts.map(getReceiptSeq)) + 1;
}

export function createEmptyReceipt(
  seq: number,
  roomMembers: readonly MeetRecordMember[],
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
  };
}
