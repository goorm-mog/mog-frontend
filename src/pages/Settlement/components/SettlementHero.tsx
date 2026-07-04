import SummaryMetric from '@/pages/Settlement/components/SummaryMetric';
import type { SETTLEMENT_SUMMARY } from '@/pages/Settlement/constants/settlementMockData';

type SettlementHeroProps = {
  summary: typeof SETTLEMENT_SUMMARY;
  allocatedTotalText: string;
  remainingText: string;
  hasRemainingAmount: boolean;
};

function SettlementHero({
  summary,
  allocatedTotalText,
  remainingText,
  hasRemainingAmount,
}: SettlementHeroProps) {
  return (
    <section className="mt-[18px] border-y border-border bg-dark-background/50">
      <div className="grid min-h-[132px] grid-cols-[1fr_116px]">
        <div className="flex min-w-0 flex-col justify-center gap-[7px] px-6 py-5">
          <span className="w-fit rounded-[5px] bg-point px-2 py-1 text-[11px] leading-[13px] font-semibold text-background">
            {summary.statusText}
          </span>
          <h2 className="truncate text-[23px] leading-[28px] font-semibold text-text">
            {summary.roomName}
          </h2>
          <p className="truncate text-[12px] leading-[15px] font-medium text-dark-border">
            {summary.datetime}
          </p>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center gap-2 border-l border-dashed border-border px-4 text-center">
          <span className="text-[12px] leading-[15px] font-semibold text-dark-border">그룹</span>
          <strong className="max-w-full truncate text-[15px] leading-[19px] font-semibold text-text">
            {summary.groupName}
          </strong>
        </div>
      </div>

      <div className="grid h-[70px] grid-cols-2 border-t border-dashed border-border">
        <SummaryMetric label="배분액" value={allocatedTotalText} />
        <SummaryMetric
          label="잔액"
          value={remainingText}
          tone={hasRemainingAmount ? 'alert' : 'default'}
        />
      </div>
    </section>
  );
}

export default SettlementHero;
