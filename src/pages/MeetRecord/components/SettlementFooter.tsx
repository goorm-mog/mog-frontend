import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type SettlementFooterProps = {
  totalAmount: number;
};

function formatWon(amount: number) {
  return amount.toLocaleString('ko-KR');
}

function SettlementFooter({ totalAmount }: SettlementFooterProps) {
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
            className={`${typography.body} h-[62px] min-w-[86px] rounded-[12px] border px-4 transition active:scale-[0.98]`}
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background,
              color: colors.darkBorder,
            }}
          >
            저장
          </button>
          <button
            type="button"
            className={`${typography.body} h-[62px] min-w-[86px] rounded-[12px] px-4 transition active:scale-[0.98]`}
            style={{ backgroundColor: colors.point, color: colors.background }}
          >
            정산
          </button>
        </div>
      </div>
    </footer>
  );
}

export default SettlementFooter;
