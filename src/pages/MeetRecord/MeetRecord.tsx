import { useNavigate } from 'react-router-dom';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import { colors } from '@/constants/colors';
import { useRouteRoomId } from '@/hooks/useRouteRoomId';
import MeetRecordEditor from '@/pages/MeetRecord/components/MeetRecordEditor';
import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import { useKeyboardViewportRecovery } from '@/pages/MeetRecord/hooks/useKeyboardViewportRecovery';
import { useMeetRecordData } from '@/pages/MeetRecord/hooks/useMeetRecordData';
import { formatMeetDate } from '@/pages/MeetRecord/utils/date';

function MeetRecord() {
  const navigate = useNavigate();
  const roomId = useRouteRoomId();
  useKeyboardViewportRecovery();
  const {
    roomName,
    roomMembers,
    confirmedSchedule,
    initialReceipts,
    initialPhotos,
    isLoading,
    loadError,
    loadVersion,
  } = useMeetRecordData(roomId);

  return (
    <main
      className="fixed inset-y-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 overflow-hidden"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <title>약속 기록</title>

      <div
        className="flex h-full w-full min-w-0 flex-col overflow-hidden"
        style={{ backgroundColor: colors.background }}
      >
        <TopAppBar
          title="기록"
          showBack
          onBack={() => navigate('/home')}
          rightSlot={<span aria-hidden className="block size-4" />}
        />
        {isLoading || loadError || roomId == null ? (
          <>
            <MeetSummary title={roomName} dateText={formatMeetDate(confirmedSchedule)} />
            <div className="grid min-h-0 flex-1 place-items-center px-5 text-center">
              {isLoading
                ? '기록을 불러오는 중입니다.'
                : (loadError ?? '올바른 약속 ID가 없습니다.')}
            </div>
            <SettlementFooter
              totalAmount={0}
              isSaveDisabled
              onSave={() => {}}
              onSettle={() => {}}
            />
          </>
        ) : (
          <MeetRecordEditor
            key={loadVersion}
            roomId={roomId}
            roomName={roomName}
            dateText={formatMeetDate(confirmedSchedule)}
            roomMembers={roomMembers}
            initialReceipts={initialReceipts}
            initialPhotos={initialPhotos}
          />
        )}
      </div>
    </main>
  );
}

export default MeetRecord;
