import MeetSummary from '@/pages/MeetRecord/components/MeetSummary';
import ReceiptCard, {
  type ReceiptCardData,
} from '@/pages/MeetRecord/components/ReceiptCard';
import RecordHeader from '@/pages/MeetRecord/components/RecordHeader';
import SettlementFooter from '@/pages/MeetRecord/components/SettlementFooter';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import { mapMeetingRecordToReceipt } from '@/pages/MeetRecord/utils/meetRecordMapper';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { colors } from '../../constants/colors';
import { mockDb } from '../../mocks/fixtures';

const room = mockDb.rooms[0];
const group = mockDb.groups.find(({ groupId }) => groupId === room.groupId);
const confirmedSchedule = mockDb.confirmedSchedules.find(
  ({ roomId }) => roomId === room.roomId,
);
const roomRecords = mockDb.meetingRecords.filter(({ roomId }) => roomId === room.roomId);
const roomMembers = mockDb.roomMembers.filter(({ roomId }) => roomId === room.roomId);

const receipts: ReceiptCardData[] = roomRecords.map((record) =>
  mapMeetingRecordToReceipt(record, roomMembers),
);

function getReceiptSeq(receipt: ReceiptCardData) {
  return Number.parseInt(receipt.roundLabel, 10) || 0;
}

function getNextReceiptSeq(receiptCards: readonly ReceiptCardData[]) {
  return Math.max(0, ...receiptCards.map(getReceiptSeq)) + 1;
}

function createEmptyReceipt(seq: number): ReceiptCardData {
  return {
    roundLabel: `${seq}차`,
    placeName: '',
    placePlaceholder: '장소를 입력하세요',
    menuPlaceholder: 'ex) 음식, 가격(1개당), 수량',
    items: [],
    totalAmount: 0,
    participants: roomMembers.map(({ roomMemberId, nickname }) => ({
      id: roomMemberId,
      name: nickname,
      selected: true,
    })),
    payerPlaceholder: '계좌를 선택하세요',
    memo: '',
    memoPlaceholder: '메모를 입력하세요',
    photoCount: 0,
  };
}

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
  const [receiptCards, setReceiptCards] = useState<ReceiptCardData[]>(receipts);
  const [pendingScrollReceiptId, setPendingScrollReceiptId] = useState<string | null>(
    null,
  );
  const nextReceiptSeqRef = useRef(getNextReceiptSeq(receipts));
  const [receiptTotals, setReceiptTotals] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      receipts.map((receipt) => [receipt.roundLabel, receipt.totalAmount]),
    ),
  );

  const handleReceiptTotalChange = useCallback(
    (receiptId: string, totalAmount: number) => {
      setReceiptTotals((currentTotals) => {
        if (currentTotals[receiptId] === totalAmount) {
          return currentTotals;
        }

        return {
          ...currentTotals,
          [receiptId]: totalAmount,
        };
      });
    },
    [],
  );

  const handleDeleteReceipt = useCallback((receiptId: string) => {
    setReceiptCards((currentReceipts) =>
      currentReceipts.filter((receipt) => receipt.roundLabel !== receiptId),
    );
    setReceiptTotals((currentTotals) => {
      const { [receiptId]: _deletedReceiptTotal, ...nextTotals } = currentTotals;

      return nextTotals;
    });
  }, []);

  const handleAddReceipt = useCallback(() => {
    const nextReceipt = createEmptyReceipt(nextReceiptSeqRef.current);
    nextReceiptSeqRef.current += 1;

    setReceiptCards((currentReceipts) => [...currentReceipts, nextReceipt]);
    setPendingScrollReceiptId(nextReceipt.roundLabel);
    setReceiptTotals((currentTotals) => ({
      ...currentTotals,
      [nextReceipt.roundLabel]: nextReceipt.totalAmount,
    }));
  }, []);

  const contentScrollRef = useWheelScrollSensitivity<HTMLElement>();

  useEffect(() => {
    if (!pendingScrollReceiptId) {
      return;
    }

    requestAnimationFrame(() => {
      const scrollElement = contentScrollRef.current;
      const receiptElement = scrollElement?.querySelector<HTMLElement>(
        `[data-receipt-id="${CSS.escape(pendingScrollReceiptId)}"]`,
      );

      if (!scrollElement || !receiptElement) {
        return;
      }

      const scrollElementRect = scrollElement.getBoundingClientRect();
      const receiptElementRect = receiptElement.getBoundingClientRect();
      const receiptTop =
        scrollElement.scrollTop + receiptElementRect.top - scrollElementRect.top;

      scrollElement.scrollTo({
        top: receiptTop,
        behavior: 'smooth',
      });
      setPendingScrollReceiptId(null);
    });
  }, [contentScrollRef, pendingScrollReceiptId, receiptCards.length]);

  const totalAmount = Object.values(receiptTotals).reduce(
    (sum, receiptTotal) => sum + receiptTotal,
    0,
  );

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

        <section
          ref={contentScrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-[14px] pb-6 promise-scrollbar-hidden"
        >
          <div className="flex flex-col gap-7">
            {receiptCards.map((receipt) => (
              <ReceiptCard
                key={receipt.roundLabel}
                receipt={receipt}
                onTotalAmountChange={handleReceiptTotalChange}
                onDelete={handleDeleteReceipt}
              />
            ))}
            <button
              type="button"
              className="grid min-h-[96px] place-items-center rounded-[8px] border-2 border-dashed transition active:scale-[0.99]"
              style={{
                borderColor: colors.border,
                backgroundColor: 'rgb(233 227 214 / 42%)',
                color: colors.darkBorder,
              }}
              onClick={handleAddReceipt}
              aria-label="새 차수 추가"
            >
              <Plus className="size-10" strokeWidth={2.2} />
            </button>
          </div>
        </section>

        <SettlementFooter totalAmount={totalAmount} />
      </div>
    </main>
  );
}

export default MeetRecord;
