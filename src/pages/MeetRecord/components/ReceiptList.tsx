import { Plus } from 'lucide-react';
import ReceiptCard from '@/pages/MeetRecord/components/ReceiptCard';
import type {
  ReceiptCardData,
  ReceiptPayerOption,
} from '@/pages/MeetRecord/types';
import { colors } from '../../../constants/colors';

type ReceiptListProps = {
  roomId: number;
  receipts: ReceiptCardData[];
  payerOptions: readonly ReceiptPayerOption[];
  resetKey: number;
  onAddReceipt: () => void;
  onReceiptChange: (receiptId: string, receipt: Partial<ReceiptCardData>) => void;
  onDeleteReceipt: (receiptId: string) => void;
};

function ReceiptList({
  roomId,
  receipts,
  payerOptions,
  resetKey,
  onAddReceipt,
  onReceiptChange,
  onDeleteReceipt,
}: ReceiptListProps) {
  return (
    <section className="px-[14px]">
      <div className="mt-5 flex flex-col gap-7">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={`${resetKey}-${receipt.roundLabel}`}
            roomId={roomId}
            receipt={receipt}
            payerOptions={payerOptions}
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
