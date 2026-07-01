import { useState } from 'react';
import { cn } from '@/lib/utils';

const TIME_SECTIONS = [
  { label: '오전', times: ['09:00', '10:00', '11:00', '12:00'] },
  { label: '오후', times: ['13:00', '14:00', '15:00', '16:00'] },
  { label: '저녁', times: ['17:00', '18:00', '19:00', '20:00'] },
];

function TimeTable() {
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());

  const toggle = (time: string) => {
    setSelectedTimes((prev) => {
      const next = new Set(prev);
      if (next.has(time)) {
        next.delete(time);
      } else {
        next.add(time);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {TIME_SECTIONS.map(({ label, times }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-text text-body2 whitespace-nowrap shrink-0">{label}</span>
          <div className="flex flex-1 gap-3">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => toggle(time)}
                className={cn(
                  'flex-1 text-center font-pretendard font-medium text-[12px] py-1.25 border border-dark-border rounded-sm',
                  selectedTimes.has(time) ? 'bg-dark-border text-background' : 'text-dark-border',
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
