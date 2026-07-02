import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import ReceiptList from '@/pages/MeetRecord/components/ReceiptList';
import RecordHeader from '@/pages/MeetRecord/components/RecordHeader';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import {
  initialMeetRecordReceipts,
  meetRecordGroup,
  meetRecordMembers,
  meetRecordRoom,
  meetRecordSchedule,
} from '@/pages/MeetRecord/constants/mockMeetRecordData';
import { useMeetRecordReceipts } from '@/pages/MeetRecord/hooks/useMeetRecordReceipts';
import { formatMeetDate } from '@/pages/MeetRecord/utils/date';
import { colors } from '../../constants/colors';

function MeetRecord() {
  const {
    receiptCards,
    totalAmount,
    pendingScrollReceiptId,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    saveReceipts,
    clearPendingScrollReceipt,
  } = useMeetRecordReceipts({
    roomId: meetRecordRoom.roomId,
    roomMembers: meetRecordMembers,
    initialReceipts: initialMeetRecordReceipts,
  });

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
        <RecordHeader groupName={meetRecordGroup?.groupName ?? '그룹 이름'} />
        <MeetSummary
          title={meetRecordRoom.roomName}
          dateText={formatMeetDate(meetRecordSchedule)}
        />

        <ReceiptList
          receipts={receiptCards}
          pendingScrollReceiptId={pendingScrollReceiptId}
          onAddReceipt={addReceipt}
          onReceiptChange={updateReceipt}
          onDeleteReceipt={deleteReceipt}
          onScrollComplete={clearPendingScrollReceipt}
        />

        <SettlementFooter totalAmount={totalAmount} onSave={saveReceipts} />
      </div>
    </main>
  );
}

export default MeetRecord;
