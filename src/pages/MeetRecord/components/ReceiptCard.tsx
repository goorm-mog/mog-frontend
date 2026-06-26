import {
  Check,
  ChevronDown,
  Cloud,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

export type ReceiptItem = {
  name: string;
  price: number;
};

export type ReceiptParticipant = {
  id: number;
  name: string;
  selected?: boolean;
};

export type ReceiptCardData = {
  roundLabel: string;
  placePlaceholder: string;
  menuPlaceholder: string;
  items: ReceiptItem[];
  totalAmount: number;
  participants: ReceiptParticipant[];
  payerPlaceholder: string;
  memoPlaceholder: string;
  photoCount: number;
};

type ReceiptCardProps = {
  receipt: ReceiptCardData;
};

function formatWon(amount: number) {
  return amount.toLocaleString('ko-KR');
}

function ReceiptCard({ receipt }: ReceiptCardProps) {
  return (
    <article className="receipt-paper min-h-[590px] px-5 pb-7 pt-10">
      <div
        className="flex items-center justify-between border-b pb-5"
        style={{ borderColor: colors.border }}
      >
        <span
          className={`${typography.body} rounded-[6px] px-2.5 py-1.5`}
          style={{ backgroundColor: colors.darkBorder, color: colors.background }}
        >
          {receipt.roundLabel}
        </span>

        <div className="flex items-center gap-6">
          <button type="button" style={{ color: colors.text }} aria-label="자동 채우기">
            <Sparkles className="size-[30px]" strokeWidth={2.1} />
          </button>
          <button type="button" style={{ color: colors.alert }} aria-label="삭제">
            <X className="size-[32px]" strokeWidth={2.1} />
          </button>
        </div>
      </div>

      <div className="space-y-7 py-7">
        <FormRow label="장소" required>
          <div
            className="flex h-12 items-center justify-between rounded-[10px] border px-5 shadow-[inset_0_1px_2px_rgba(27,26,18,0.06)]"
            style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
          >
            <span className={typography.caption} style={{ color: colors.border }}>
              {receipt.placePlaceholder}
            </span>
            <Search className="size-6" strokeWidth={2.5} color={colors.text} />
          </div>
        </FormRow>

        <FormRow label="메뉴">
          <div>
            <div
              className="flex h-9 items-center justify-between border-b"
              style={{ borderColor: colors.darkBorder }}
            >
              <span className={`${typography.caption} pl-5`} style={{ color: colors.border }}>
                {receipt.menuPlaceholder}
              </span>
              <Plus className="size-6" strokeWidth={2.8} color={colors.text} />
            </div>
            <div
              className={`${typography.caption} mt-3 space-y-1 px-6`}
              style={{ color: colors.text }}
            >
              {receipt.items.map((item) => (
                <div key={`${receipt.roundLabel}-${item.name}`} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{formatWon(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </FormRow>
      </div>

      <DashedDivider />

      <FormRow label="총액" required className="py-7">
        <p className={`${typography.head1} text-right`} style={{ color: colors.text }}>
          <span className="mr-4">₩</span>
          {formatWon(receipt.totalAmount)}
        </p>
      </FormRow>

      <DashedDivider />

      <FormRow label="참가자" required className="py-7">
        <div className="flex items-start gap-3 overflow-x-auto pb-1 promise-scrollbar-hidden">
          <button
            type="button"
            className="grid size-[62px] shrink-0 place-items-center rounded-full border-[3px] border-dashed"
            style={{ borderColor: colors.border, color: colors.text }}
            aria-label="참가자 추가"
          >
            <Plus className="size-8" strokeWidth={2.2} />
          </button>

          {receipt.participants.map((participant) => (
            <div key={participant.id} className="w-[64px] shrink-0 text-center">
              <div
                className={`relative mx-auto grid size-[62px] place-items-center rounded-full border-[3px] ${
                  participant.selected ? '' : 'border-dashed'
                }`}
                style={{
                  borderColor: participant.selected ? colors.text : colors.border,
                  backgroundColor: participant.selected ? colors.background : 'transparent',
                  color: colors.text,
                }}
              >
                <Cloud className="size-10" strokeWidth={2.2} />
                {participant.selected ? (
                  <span
                    className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full"
                    style={{ backgroundColor: colors.text, color: colors.background }}
                  >
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                ) : null}
              </div>
              <p className={`${typography.caption} mt-2`} style={{ color: colors.text }}>
                {participant.name}
              </p>
            </div>
          ))}
        </div>
      </FormRow>

      <FormRow label="계좌">
        <div
          className="flex h-10 items-center justify-between border-b px-3"
          style={{ borderColor: colors.darkBorder }}
        >
          <span className={typography.caption} style={{ color: colors.border }}>
            {receipt.payerPlaceholder}
          </span>
          <ChevronDown className="size-6" strokeWidth={2.5} color={colors.text} />
        </div>
      </FormRow>

      <div className="my-7 border-t" style={{ borderColor: colors.border }} />

      <FormRow label="메모">
        <div
          className="flex h-11 items-center rounded-[10px] border px-5"
          style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
        >
          <span className={typography.caption} style={{ color: colors.border }}>
            {receipt.memoPlaceholder}
          </span>
        </div>
      </FormRow>

      <DashedDivider className="my-7" />

      <div className="px-2">
        <div className="flex items-center justify-between">
          <h3 className={typography.body} style={{ color: colors.text }}>
            사진 선택
          </h3>
          <p className={typography.caption} style={{ color: colors.border }}>
            최대 5장
          </p>
        </div>

        <div className="mt-7 flex gap-4 overflow-x-auto pb-1 promise-scrollbar-hidden">
          <button
            type="button"
            className="grid h-[60px] w-[72px] shrink-0 place-items-center rounded-[5px] border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.darkBackground,
              color: colors.border,
            }}
            aria-label="사진 추가"
          >
            <Plus className="size-8" strokeWidth={2.2} />
          </button>

          {Array.from({ length: receipt.photoCount }).map((_, index) => (
            <div
              key={`${receipt.roundLabel}-photo-${index}`}
              className="photo-checker relative h-[60px] w-[72px] shrink-0 rounded-[5px] border"
              style={{ borderColor: index === 0 ? colors.point : colors.border }}
            >
              <button
                type="button"
                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full"
                style={{ backgroundColor: colors.border, color: colors.darkBackground }}
                aria-label="사진 제거"
              >
                <X className="size-4" strokeWidth={2.1} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

type FormRowProps = {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

function FormRow({ label, required = false, className = '', children }: FormRowProps) {
  return (
    <div className={`grid grid-cols-[90px_1fr] items-start gap-4 px-2 ${className}`}>
      <label className={`${typography.body} pt-3`} style={{ color: colors.text }}>
        {label}
        {required ? (
          <span className="ml-1" style={{ color: colors.alert }}>
            *
          </span>
        ) : null}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

type DashedDividerProps = {
  className?: string;
};

function DashedDivider({ className = '' }: DashedDividerProps) {
  return (
    <div
      className={`border-t-[3px] border-dashed ${className}`}
      style={{ borderColor: colors.border }}
    />
  );
}

export default ReceiptCard;
