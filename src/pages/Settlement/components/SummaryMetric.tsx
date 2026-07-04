import { cn } from '@/lib/utils';

type SummaryMetricProps = {
  label: string;
  value: string;
  tone?: 'default' | 'alert';
};

function SummaryMetric({ label, value, tone = 'default' }: SummaryMetricProps) {
  return (
    <div className="flex flex-col justify-center gap-1 px-6 even:border-l even:border-dashed even:border-border">
      <span className="text-[12px] leading-[15px] font-semibold text-dark-border">{label}</span>
      <span
        className={cn(
          'text-[20px] leading-[24px] font-semibold',
          tone === 'alert' ? 'text-alert' : 'text-text',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default SummaryMetric;
