import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTabsProps {
  dates: Date[];
  activeDateKey: string;
  timesByDate: Record<string, string[]>;
  datesWithNoMatch?: string[];
  onTabClick: (key: string) => void;
}

function DateTabs({
  dates,
  activeDateKey,
  timesByDate,
  datesWithNoMatch = [],
  onTabClick,
}: DateTabsProps) {
  if (dates.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {dates.map((date) => {
        const key = format(date, 'yyyy-MM-dd');
        const count = timesByDate[key]?.length ?? 0;
        const isActive = key === activeDateKey;
        const hasNoMatch = datesWithNoMatch.includes(key);

        return (
          <button
            key={key}
            onClick={() => onTabClick(key)}
            className={cn(
              'flex items-center gap-1 px-3 py-1 rounded-full border font-pretendard text-[12px] transition-colors',
              isActive
                ? 'bg-dark-border border-dark-border text-background'
                : hasNoMatch
                  ? 'border-point/50 text-dark-border'
                  : 'border-dark-border text-dark-border',
            )}
          >
            {format(date, 'M/d')}
            {hasNoMatch ? (
              <AlertCircle size={10} className={isActive ? 'text-background' : 'text-point'} />
            ) : (
              count > 0 && <span>· {count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default DateTabs;
