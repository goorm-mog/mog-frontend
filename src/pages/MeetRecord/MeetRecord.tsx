import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import ReceiptCard, {
  type ReceiptCardData,
} from '@/pages/MeetRecord/components/ReceiptCard';
import RecordHeader from '@/pages/MeetRecord/components/RecordHeader';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import { colors } from '../../constants/colors';
import { mockDb } from '../../mocks/fixtures';

const room = mockDb.rooms[0];
const group = mockDb.groups.find(({ groupId }) => groupId === room.groupId);
const confirmedSchedule = mockDb.confirmedSchedules.find(
  ({ roomId }) => roomId === room.roomId,
);
const roomRecords = mockDb.meetingRecords.filter(({ roomId }) => roomId === room.roomId);
const roomMembers = mockDb.roomMembers.filter(({ roomId }) => roomId === room.roomId);

const receipts: ReceiptCardData[] = roomRecords.map((record) => {
  const participantIds = new Set(
    record.participants.map(({ roomMemberId }) => roomMemberId),
  );

  return {
    roundLabel: `${record.seq}차`,
    placePlaceholder: record.placeName,
    menuPlaceholder: 'ex) 000(음식) - 8,000(가격)',
    items: record.menuItems.map(({ menuName, price }) => ({
      name: menuName,
      price,
    })),
    totalAmount: record.totalCost,
    participants: roomMembers.map(({ roomMemberId, nickname }) => ({
      id: roomMemberId,
      name: nickname,
      selected: participantIds.has(roomMemberId),
    })),
    payerPlaceholder: `${record.payer.bankName} ${record.payer.accountNumber}`,
    memoPlaceholder: record.memo,
    photoCount: record.photoCount,
  };
});

const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);

function formatMeetDate() {
  if (!confirmedSchedule) {
    return 'yyyy. mm. dd (요일)  hh:mm am/pm';
  }

  const date = new Date(`${confirmedSchedule.date}T${confirmedSchedule.time}:00`);
  const dateText = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
  const timeText = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${dateText}  ${timeText}`;
}

function MeetRecord() {
  return (
    <main
      className="min-h-dvh"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <title>약속 기록</title>

      <div
        className="mx-auto flex h-dvh min-h-[844px] w-full min-w-[390px] max-w-[430px] flex-col overflow-hidden"
        style={{ backgroundColor: colors.background }}
      >
        <RecordHeader groupName={group?.groupName ?? '그룹 이름'} />
        <MeetSummary title={room.roomName} dateText={formatMeetDate()} />

        <section className="min-h-0 flex-1 overflow-y-auto px-[14px] pb-6 promise-scrollbar-hidden">
          <div className="flex flex-col gap-7">
            {receipts.map((receipt) => (
              <ReceiptCard key={receipt.roundLabel} receipt={receipt} />
            ))}
          </div>
        </section>

        <SettlementFooter totalAmount={totalAmount} />
      </div>
    </main>
  );
}

export default MeetRecord;
