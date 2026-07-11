import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import { colors } from '@/constants/colors';
import PhotoPicker from '@/pages/MeetRecord/components/PhotoPicker';
import ReceiptList from '@/pages/MeetRecord/components/ReceiptList';
import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import { useReceiptAutoScroll } from '@/pages/MeetRecord/hooks/useReceiptAutoScroll';
import { useMeetRecordReceipts } from '@/pages/MeetRecord/hooks/useMeetRecordReceipts';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import { toPayerOptions, type MeetRecordMember } from '@/pages/MeetRecord/utils/meetRecordMapper';
import type { RoomRecordPhoto } from '@/types/records';

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
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[calc(24px+env(safe-area-inset-bottom))] promise-scrollbar-hidden [-webkit-overflow-scrolling:touch] overscroll-contain"
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

          <section className="mx-5 border-t pb-5 pt-5" style={{ borderColor: colors.border }}>
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

export default MeetRecordEditor;
