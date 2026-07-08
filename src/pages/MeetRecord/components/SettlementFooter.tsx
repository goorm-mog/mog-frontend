import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { formatWon } from '@/pages/MeetRecord/utils/receipt';
import { colors } from '../../../constants/colors';

type SettlementFooterProps = {
  totalAmount: number;
  isSaving?: boolean;
  isSaveDisabled?: boolean;
  errorMessage?: string | null;
  onSave: () => void;
  onSettle: () => void;
};

function SettlementFooter({
  totalAmount,
  isSaving = false,
  isSaveDisabled = false,
  errorMessage = null,
  onSave,
  onSettle,
}: SettlementFooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setIsExpanded(true);
    }
  }, [errorMessage]);

  return (
    <footer
      className="relative shrink-0 border-t shadow-[0_-8px_28px_rgba(57,48,34,0.08)]"
      style={{ borderColor: colors.darkBorder, backgroundColor: colors.background }}
    >
      <div className="absolute inset-x-0 top-0 flex -translate-y-full justify-center">
        <button
          type="button"
          className="flex h-8 w-[88px] items-center justify-center rounded-t-[8px] border border-b-0 shadow-[0_-6px_16px_rgba(57,48,34,0.08)] transition active:bg-[rgb(233_227_214_/_0.42)]"
          style={{
            borderColor: colors.darkBorder,
            backgroundColor: colors.background,
            color: colors.darkBorder,
          }}
          aria-label={isExpanded ? '정산 바 접기' : '정산 바 펼치기'}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? (
            <ChevronDown size={22} strokeWidth={2.4} />
          ) : (
            <ChevronUp size={22} strokeWidth={2.4} />
          )}
        </button>
      </div>

      {isExpanded ? (
        <div className="px-5 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p
                className="font-pretendard text-[16px] leading-[20px] font-semibold"
                style={{ color: colors.darkBorder }}
              >
                총 소비 금액
              </p>
              <p
                className="mt-2 font-noto-serif text-[24px] leading-[32px] font-bold"
                style={{ color: colors.text }}
              >
                <span className="mr-2">₩</span>
                {formatWon(totalAmount)}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className="h-11 min-w-[76px] rounded-md border px-4 font-pretendard text-[16px] leading-[20px] font-semibold transition active:scale-[0.98]"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.darkBorder,
                }}
                disabled={isSaving || isSaveDisabled}
                onClick={onSave}
              >
                {isSaving ? '저장 중' : '저장'}
              </button>
              <Button
                variant="point"
                size="md"
                fullWidth={false}
                className="min-w-[76px] text-[16px] font-semibold transition active:scale-[0.98]"
                disabled={isSaving || isSaveDisabled}
                onClick={onSettle}
              >
                정산
              </Button>
            </div>
          </div>
          {errorMessage ? (
            <p
              className="mt-3 font-pretendard text-[16px] leading-[20px]"
              style={{ color: colors.alert }}
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      ) : null}
    </footer>
  );
}

export default SettlementFooter;
