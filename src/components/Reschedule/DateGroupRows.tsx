import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateGroup {
  groupKey: string;
  dates: Date[];
  availableTimes: string[];
}

interface DateGroupRowsProps {
  groups: DateGroup[];
  activeGroupKey: string;
  selectedDateKeys: string[];
  voteByDate: Record<string, string[]>;
  onRowClick: (groupKey: string) => void;
  onDateToggle: (dateKey: string) => void;
  onGroupSelectAll: (groupKey: string) => void;
  onGroupClearAll: (groupKey: string) => void;
}

function DateGroupRows({
  groups,
  activeGroupKey,
  selectedDateKeys,
  voteByDate,
  onRowClick,
  onDateToggle,
  onGroupSelectAll,
  onGroupClearAll,
}: DateGroupRowsProps) {
  return (
    <div className="flex flex-col gap-2">
      {groups.map(({ groupKey, dates }) => {
        const isActive = groupKey === activeGroupKey;
        const isMulti = dates.length > 1;
        const allChecked =
          isActive && dates.every((d) => selectedDateKeys.includes(format(d, 'yyyy-MM-dd')));

        if (isMulti) {
          return (
            <div
              key={groupKey}
              onClick={() => onRowClick(groupKey)}
              className={cn(
                'flex flex-col gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                isActive ? 'border-point' : 'border-dark-border',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-pretendard text-[10px] text-dark-border">묶음</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (allChecked) {
                      onGroupClearAll(groupKey);
                    } else {
                      onGroupSelectAll(groupKey);
                    }
                  }}
                  className="font-pretendard text-[10px] text-dark-border"
                >
                  {allChecked ? '전체 취소' : '전체'}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {dates.map((date) => {
                  const key = format(date, 'yyyy-MM-dd');
                  const count = voteByDate[key]?.length ?? 0;
                  const isChecked = isActive && selectedDateKeys.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isActive) {
                          onDateToggle(key);
                        } else {
                          onRowClick(groupKey);
                        }
                      }}
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

        // 단독 행
        const date = dates[0];
        const key = format(date, 'yyyy-MM-dd');
        const count = voteByDate[key]?.length ?? 0;
        return (
          <button
            key={groupKey}
            onClick={() => onRowClick(groupKey)}
            className={cn(
              'self-start flex items-center gap-1 px-3 py-1 rounded-full border font-pretendard text-[12px] transition-colors',
              isActive
                ? 'border-point bg-dark-border text-background'
                : 'border-dark-border text-dark-border',
            )}
          >
            {isActive && <Check size={10} strokeWidth={2.5} />}
            {format(date, 'M/d')}
            {count > 0 && ` · ${count}`}
          </button>
        );
      })}
    </div>
  );
}

export default DateGroupRows;
