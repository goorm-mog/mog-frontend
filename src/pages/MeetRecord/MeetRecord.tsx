import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import { fetchMeetingRecords } from '@/api/records';
import {
  fetchMeetDetailConfirmedSchedule,
  fetchRoomStatus,
} from '@/features/meetDetail/api/meetDetail';
import type { ConfirmedScheduleResponse } from '@/features/meetDetail/types';
import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import ReceiptList from '@/pages/MeetRecord/components/ReceiptList';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import { useMeetRecordReceipts } from '@/pages/MeetRecord/hooks/useMeetRecordReceipts';
import { formatMeetDate } from '@/pages/MeetRecord/utils/date';
import {
  mapMeetingRecordToReceipt,
  toPayerOptions,
  type MeetRecordMember,
} from '@/pages/MeetRecord/utils/meetRecordMapper';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import { colors } from '../../constants/colors';

function MeetRecord() {
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams();
  const roomId = Number(roomIdParam ?? 45);
  const [roomName, setRoomName] = useState('약속 기록');
  const [roomMembers, setRoomMembers] = useState<MeetRecordMember[]>([]);
  const [confirmedSchedule, setConfirmedSchedule] =
    useState<ConfirmedScheduleResponse | null>(null);
  const [initialReceipts, setInitialReceipts] = useState<ReceiptCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetRecord() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [room, recordsResponse, schedule] = await Promise.all([
          fetchRoomStatus(roomId),
          fetchMeetingRecords(roomId),
          fetchMeetDetailConfirmedSchedule(roomId).catch(() => null),
        ]);

        if (!isMounted) return;

        const members = room.members.map((member) => {
          if (!Number.isFinite(member.roomMemberId)) {
            throw new Error('방 멤버 식별자(roomMemberId)가 응답에 없습니다.');
          }

          return {
            roomMemberId: member.roomMemberId,
            nickname: member.nickname,
            bankName: member.bankName ?? null,
            accountNumber: member.accountNumber ?? null,
          };
        });

        setRoomName(room.roomName);
        setRoomMembers(members);
        setConfirmedSchedule(schedule);
        setInitialReceipts(
          recordsResponse.data.records
            .slice()
            .sort((a, b) => a.seq - b.seq)
            .map((record) => mapMeetingRecordToReceipt(record, members)),
        );
      } catch (error) {
        if (!isMounted) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : '약속 기록을 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMeetRecord();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  const {
    receiptCards,
    totalAmount,
    pendingScrollReceiptId,
    isSaving,
    saveError,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    saveReceipts,
    clearPendingScrollReceipt,
  } = useMeetRecordReceipts({
    roomId,
    roomMembers,
    initialReceipts,
  });
  const payerOptions = useMemo(() => toPayerOptions(roomMembers), [roomMembers]);

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
          title={roomName}
          showBack
          onBack={() => navigate(-1)}
        />
        <MeetSummary
          title={roomName}
          dateText={formatMeetDate(confirmedSchedule)}
        />

        {isLoading ? (
          <div className="grid min-h-0 flex-1 place-items-center px-5 text-center">
            기록을 불러오는 중입니다.
          </div>
        ) : loadError ? (
          <div className="grid min-h-0 flex-1 place-items-center px-5 text-center">
            {loadError}
          </div>
        ) : (
          <ReceiptList
            receipts={receiptCards}
            payerOptions={payerOptions}
            pendingScrollReceiptId={pendingScrollReceiptId}
            onAddReceipt={addReceipt}
            onReceiptChange={updateReceipt}
            onDeleteReceipt={deleteReceipt}
            onScrollComplete={clearPendingScrollReceipt}
          />
        )}

        <SettlementFooter
          totalAmount={totalAmount}
          isSaving={isSaving}
          errorMessage={saveError}
          onSave={saveReceipts}
        />
      </div>
    </main>
  );
}

export default MeetRecord;
