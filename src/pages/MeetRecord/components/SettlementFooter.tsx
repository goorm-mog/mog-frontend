import { Button } from '@/components/common/Button';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type SettlementFooterProps = {
  totalAmount: number;
  onSave: () => void;
};

function formatWon(amount: number) {
  return amount.toLocaleString('ko-KR');
}

function SettlementFooter({ totalAmount, onSave }: SettlementFooterProps) {
  return (
    <footer
      className="shrink-0 border-t px-5 pb-7 pt-4 shadow-[0_-8px_28px_rgba(57,48,34,0.08)]"
      style={{ borderColor: colors.darkBorder, backgroundColor: colors.background }}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className={typography.body} style={{ color: colors.darkBorder }}>
            총 소비 금액
          </p>
          <p className={`${typography.head1} mt-3`} style={{ color: colors.text }}>
            <span className="mr-3">₩</span>
            {formatWon(totalAmount)}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            className={`${typography.body} h-[52px] min-w-[86px] rounded-md border px-6 transition active:scale-[0.98]`}
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
              color: colors.darkBorder,
            }}
            onClick={onSave}
          >
            저장
          </button>
          <Button
            variant="point"
            size="lg"
            fullWidth={false}
            className={`${typography.body} min-w-[86px] transition active:scale-[0.98]`}
          >
            정산
          </Button>
        </div>
      </div>
    </footer>
  );
}

export default SettlementFooter;
