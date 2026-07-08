import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import { fetchMeetingRecords } from '@/api/records';
import {
  fetchMeetDetailConfirmedSchedule,
  fetchRoomStatus,
} from '@/features/meetDetail/api/meetDetail';
import type { ConfirmedScheduleResponse } from '@/features/meetDetail/types';
import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import PhotoPicker from '@/pages/MeetRecord/components/PhotoPicker';
import ReceiptList from '@/pages/MeetRecord/components/ReceiptList';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import { useReceiptAutoScroll } from '@/pages/MeetRecord/hooks/useReceiptAutoScroll';
import { useMeetRecordReceipts } from '@/pages/MeetRecord/hooks/useMeetRecordReceipts';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import { formatMeetDate } from '@/pages/MeetRecord/utils/date';
import {
  mapMeetingRecordToReceipt,
  toPayerOptions,
  type MeetRecordMember,
} from '@/pages/MeetRecord/utils/meetRecordMapper';
import type { RoomRecordPhoto } from '@/types/records';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import { colors } from '../../constants/colors';

function MeetRecord() {
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams();
  const roomId = parseRoomId(roomIdParam);
  const [roomName, setRoomName] = useState('약속 기록');
  const [roomMembers, setRoomMembers] = useState<MeetRecordMember[]>([]);
  const [confirmedSchedule, setConfirmedSchedule] =
    useState<ConfirmedScheduleResponse | null>(null);
  const [initialReceipts, setInitialReceipts] = useState<ReceiptCardData[]>([]);
  const [initialPhotos, setInitialPhotos] = useState<RoomRecordPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetRecord() {
      setIsLoading(true);
      setLoadError(null);

      try {
        if (roomId == null) {
          throw new Error('올바른 약속 ID가 없습니다.');
        }

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
        setInitialPhotos(recordsResponse.data.photos);
        setLoadVersion((version) => version + 1);
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
        {isLoading || loadError || roomId == null ? (
          <>
            <MeetSummary
              title={roomName}
              dateText={formatMeetDate(confirmedSchedule)}
            />
            <div className="grid min-h-0 flex-1 place-items-center px-5 text-center">
              {isLoading ? '기록을 불러오는 중입니다.' : (loadError ?? '올바른 약속 ID가 없습니다.')}
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

type MeetRecordEditorProps = {
  roomId: number;
  roomName: string;
  dateText: string;
  roomMembers: MeetRecordMember[];
  initialReceipts: ReceiptCardData[];
  initialPhotos: RoomRecordPhoto[];
};

function MeetRecordEditor({
  roomId,
  roomName,
  dateText,
  roomMembers,
  initialReceipts,
  initialPhotos,
}: MeetRecordEditorProps) {
  const navigate = useNavigate();
  const contentScrollRef = useWheelScrollSensitivity<HTMLElement>();
  const {
    receiptCards,
    roomPhotos,
    receiptsVersion,
    hasUnsavedChanges,
    totalAmount,
    pendingScrollReceiptId,
    isSaving,
    saveError,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    uploadPhotos,
    deletePhoto,
    saveReceipts,
    clearPendingScrollReceipt,
  } = useMeetRecordReceipts({
    roomId,
    roomMembers,
    initialReceipts,
    initialPhotos,
  });
  const payerOptions = useMemo(() => toPayerOptions(roomMembers), [roomMembers]);

  useReceiptAutoScroll({
    scrollRef: contentScrollRef,
    receiptCount: receiptCards.length,
    receiptId: pendingScrollReceiptId,
    onScrollComplete: clearPendingScrollReceipt,
  });

  return (
    <>
      <section
        ref={contentScrollRef}
        className="min-h-0 flex-1 overflow-y-auto pb-6 promise-scrollbar-hidden"
      >
        <div
          className="pointer-events-none sticky top-0 z-20 h-5"
          style={{
            background: `linear-gradient(180deg, ${colors.background} 0%, rgb(255 250 243 / 88%) 35%, rgb(255 250 243 / 0%) 100%)`,
          }}
          aria-hidden="true"
        />

        <StepHeader
          showStep={false}
          wrapperClassName="px-4 pb-5 pt-0"
          className="w-full"
          contentClassName="flex flex-col px-0 py-0"
        >
          <MeetSummary title={roomName} dateText={dateText} />

          <section
            className="mx-5 border-t pb-5 pt-5"
            style={{ borderColor: colors.border }}
          >
            <PhotoPicker
              photos={roomPhotos}
              onUploadPhotos={uploadPhotos}
              onDeletePhoto={deletePhoto}
            />
          </section>
        </StepHeader>

        <ReceiptList
          roomId={roomId}
          receipts={receiptCards}
          payerOptions={payerOptions}
          resetKey={receiptsVersion}
          onAddReceipt={addReceipt}
          onReceiptChange={updateReceipt}
          onDeleteReceipt={deleteReceipt}
        />
      </section>

      <SettlementFooter
        totalAmount={totalAmount}
        isSaving={isSaving}
        errorMessage={saveError}
        onSave={saveReceipts}
        onSettle={() => {
          if (
            hasUnsavedChanges &&
            !window.confirm('저장하지 않은 변경사항이 있습니다. 정산 화면으로 이동할까요?')
          ) {
            return;
          }

          navigate(`/${roomId}/settlement`);
        }}
      />
    </>
  );
}

function parseRoomId(roomIdParam: string | undefined) {
  if (!roomIdParam) return null;

  const roomId = Number(roomIdParam);
  return Number.isInteger(roomId) && roomId > 0 ? roomId : null;
}

export default MeetRecord;
