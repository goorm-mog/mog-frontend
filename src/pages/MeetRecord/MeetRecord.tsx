import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMeetingRecords } from '@/api/records';
import { fetchRoom } from '@/api/rooms';
import { fetchConfirmedSchedule, fetchRoomMembers } from '@/api/schedule';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import ReceiptList from '@/pages/MeetRecord/components/ReceiptList';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import { useMeetRecordReceipts } from '@/pages/MeetRecord/hooks/useMeetRecordReceipts';
import { formatMeetDate } from '@/pages/MeetRecord/utils/date';
import { mapMeetingRecordToReceipt } from '@/pages/MeetRecord/utils/meetRecordMapper';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import { colors } from '../../constants/colors';
import type { ConfirmScheduleResponse } from '@/types/schedule';
import type { RoomDetail, RoomMember } from '@/types/rooms';

const DEFAULT_ROOM_ID = 45;

function MeetRecord() {
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [confirmedSchedule, setConfirmedSchedule] =
    useState<ConfirmScheduleResponse | null>(null);
  const [initialReceipts, setInitialReceipts] = useState<ReceiptCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadMeetRecord() {
      setIsLoading(true);

      try {
        const [roomResponse, membersResponse, scheduleResponse, recordsResponse] =
          await Promise.all([
            fetchRoom(DEFAULT_ROOM_ID),
            fetchRoomMembers(DEFAULT_ROOM_ID),
            fetchConfirmedSchedule(DEFAULT_ROOM_ID),
            fetchMeetingRecords(DEFAULT_ROOM_ID),
          ]);
        const members = membersResponse.members.filter(
          (member): member is RoomMember =>
            member.roomMemberId !== undefined &&
            member.roomId !== undefined &&
            member.role !== undefined &&
            member.bankName !== undefined &&
            member.accountNumber !== undefined,
        );

        if (ignore) return;

        setRoom(roomResponse.data);
        setRoomMembers(members);
        setConfirmedSchedule(scheduleResponse);
        setInitialReceipts(
          recordsResponse.data.records.map((record) =>
            mapMeetingRecordToReceipt(record, members),
          ),
        );
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadMeetRecord();

    return () => {
      ignore = true;
    };
  }, []);

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
    roomId: room?.roomId ?? DEFAULT_ROOM_ID,
    roomMembers,
    initialReceipts,
  });
  const payerOptions = useMemo(() => roomMembers.map(
    ({ roomMemberId, nickname, bankName, accountNumber }) => ({
      id: roomMemberId,
      label: `${nickname}(${bankName} : ${accountNumber})`,
    }),
  ), [roomMembers]);

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
        <TopAppBar
          title={room?.groupName ?? '그룹 이름'}
          showBack
          onBack={() => navigate(-1)}
        />
        <MeetSummary
          title={room?.roomName ?? (isLoading ? '불러오는 중' : '약속 이름')}
          dateText={formatMeetDate(confirmedSchedule)}
        />

        <ReceiptList
          receipts={receiptCards}
          payerOptions={payerOptions}
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
