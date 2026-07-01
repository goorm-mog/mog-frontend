import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TIME_SECTIONS } from '@/constants/time';

interface TimeTableProps {
  selectedTimes: string[];
  onToggle: (time: string) => void;
  onSelectSection: (times: string[]) => void;
  onClearSection: (times: string[]) => void;
  availableTimes?: string[];
}

function TimeTable({
  selectedTimes,
  onToggle,
  onSelectSection,
  onClearSection,
  availableTimes,
}: TimeTableProps) {
  const sections = useMemo(
    () =>
      TIME_SECTIONS.map(({ label, times }) => ({
        label,
        times: availableTimes ? times.filter((t) => availableTimes.includes(t)) : times,
      })).filter(({ times }) => times.length > 0),
    [availableTimes],
  );

  return (
    <div className="flex flex-col gap-5">
      {sections.map(({ label, times }) => (
        <div key={label} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-text text-body2">{label}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectSection(times)}
                className="font-pretendard text-[10px] text-dark-border"
              >
                전체
              </button>
              <span className="text-[10px] text-dark-border">·</span>
              <button
                onClick={() => onClearSection(times)}
                className="font-pretendard text-[10px] text-dark-border"
              >
                취소
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => onToggle(time)}
                className={cn(
                  'flex-1 text-center font-pretendard font-medium text-[12px] py-1.5 border border-dark-border rounded-sm',
                  selectedTimes.includes(time)
                    ? 'bg-dark-border text-background'
                    : 'text-dark-border',
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TimeTable;
