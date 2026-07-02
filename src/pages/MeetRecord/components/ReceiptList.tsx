import { Plus } from 'lucide-react';
import ReceiptCard from '@/pages/MeetRecord/components/ReceiptCard';
import { useReceiptAutoScroll } from '@/pages/MeetRecord/hooks/useReceiptAutoScroll';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import { colors } from '../../../constants/colors';

type ReceiptListProps = {
  receipts: ReceiptCardData[];
  pendingScrollReceiptId: string | null;
  onAddReceipt: () => void;
  onReceiptChange: (receiptId: string, receipt: Partial<ReceiptCardData>) => void;
  onDeleteReceipt: (receiptId: string) => void;
  onScrollComplete: () => void;
};

function ReceiptList({
  receipts,
  pendingScrollReceiptId,
  onAddReceipt,
  onReceiptChange,
  onDeleteReceipt,
  onScrollComplete,
}: ReceiptListProps) {
  const contentScrollRef = useWheelScrollSensitivity<HTMLElement>();

  useReceiptAutoScroll({
    scrollRef: contentScrollRef,
    receiptCount: receipts.length,
    receiptId: pendingScrollReceiptId,
    onScrollComplete,
  });

  return (
    <section
      ref={contentScrollRef}
      className="min-h-0 flex-1 overflow-y-auto px-[14px] pb-6 promise-scrollbar-hidden"
    >
      <div
        className="pointer-events-none sticky top-0 z-20 -mx-[14px] -mb-5 h-5"
        style={{
          background: `linear-gradient(180deg, ${colors.background} 0%, rgb(255 250 243 / 88%) 35%, rgb(255 250 243 / 0%) 100%)`,
        }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-7 mt-5">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt.roundLabel}
            receipt={receipt}
            onReceiptChange={onReceiptChange}
            onDelete={onDeleteReceipt}
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
          onClick={onAddReceipt}
          aria-label="새 차수 추가"
        >
          <Plus className="size-10" strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}

export default ReceiptList;
