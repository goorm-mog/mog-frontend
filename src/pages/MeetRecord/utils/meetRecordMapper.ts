import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import type { MockDb } from '@/mocks/fixtures';

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
    placePlaceholder: '장소를 입력하세요',
    menuPlaceholder: 'ex) 음식, 가격(1개당), 수량',
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
    payerPlaceholder: `${record.payer.bankName} ${record.payer.accountNumber}`,
    memoPlaceholder: record.memo,
    photoCount: record.photoCount,
  };
}
