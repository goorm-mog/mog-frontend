import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateCheckboxesProps {
  dates: Date[];
  targetDateKeys: string[];
  timesByDate: Record<string, string[]>;
  onToggle: (key: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  disabled?: boolean;
}

function DateCheckboxes({
  dates,
  targetDateKeys,
  timesByDate,
  onToggle,
  onSelectAll,
  onClearAll,
  disabled = false,
}: DateCheckboxesProps) {
  if (dates.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-2', disabled && 'opacity-40 pointer-events-none')}>
      <div className="flex items-center justify-between">
        <span className="text-text text-body2">적용할 날짜</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAll}
            className="font-pretendard text-[10px] text-dark-border"
          >
            전체
          </button>
          <span className="text-[10px] text-dark-border">·</span>
          <button
            onClick={onClearAll}
            className="font-pretendard text-[10px] text-dark-border"
          >
            취소
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {dates.map((date) => {
          const key = format(date, 'yyyy-MM-dd');
          const count = timesByDate[key]?.length ?? 0;
          const isChecked = targetDateKeys.includes(key);

          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className={cn(
                'flex items-center gap-1 px-3 py-1 rounded-full border border-dark-border font-pretendard text-[12px] transition-colors',
                isChecked ? 'bg-dark-border text-background' : 'text-dark-border',
              )}
            >
              {isChecked && <Check size={10} strokeWidth={2.5} />}
              {format(date, 'M/d')}
              {count > 0 && ` · ${count}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DateCheckboxes;
