import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import type { MockDb } from '@/mocks/fixtures';
import { receiptCopy } from '@/pages/MeetRecord/constants/receiptCopy';

type MeetingRecord = MockDb['meetingRecords'][number];
type RoomMember = MockDb['roomMembers'][number];

export function mapMeetingRecordToReceipt(
  record: MeetingRecord,
  roomMembers: readonly RoomMember[],
): ReceiptCardData {
  const participantIds = new Set(
    record.participants.map(({ roomMemberId }) => roomMemberId),
  );

  return {
    roundLabel: `${record.seq}차`,
    placeName: record.placeName,
    placePlaceholder: receiptCopy.placePlaceholder,
    menuPlaceholder: receiptCopy.menuPlaceholder,
    items: record.menuItems.map(({ menuName, count, price }) => ({
      name: menuName,
      count,
      price,
    })),
    totalAmount: record.totalPrice,
    participants: roomMembers.map(({ roomMemberId, nickname }) => ({
      id: roomMemberId,
      name: nickname,
      selected: participantIds.has(roomMemberId),
    })),
    payerPlaceholder: `${record.payer.nickname}(${record.payer.bankName} : ${record.payer.accountNumber})`,
    memo: record.memo,
    memoPlaceholder: receiptCopy.memoPlaceholder,
    photoCount: record.photoCount,
  };
}
