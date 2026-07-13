import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TIME_SECTIONS } from '@/constants/time';
import type { ScheduleSlot } from '@/features/schedule/types/schedule';

interface VoteResultTimeListProps {
  slots: ScheduleSlot[];
  totalParticipants: number;
}

function VoteResultTimeList({ slots, totalParticipants }: VoteResultTimeListProps) {
  const slotByTime = useMemo(() => Object.fromEntries(slots.map((s) => [s.time, s])), [slots]);

  return (
    <div className="flex flex-col gap-5 pb-10">
      {TIME_SECTIONS.map(({ label, times }) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="text-text text-body2">{label}</span>
          <div className="flex gap-2">
            {times.map((time) => {
              const slot = slotByTime[time];
              const opacity =
                slot && slot.voteCount > 0
                  ? Math.max(0.15, slot.voteCount / Math.max(totalParticipants, 1))
                  : 0;

              return (
                <div
                  key={time}
                  className={cn(
                    'relative flex-1 text-center font-pretendard font-medium text-[12px] py-1.5 rounded-sm overflow-hidden',
                    !slot
                      ? 'border border-dark-border text-dark-border opacity-30'
                      : slot.voteCount > 0
                        ? 'text-background'
                        : 'border border-dark-border text-dark-border',
                  )}
                >
                  {slot && <div className="absolute inset-0 bg-point" style={{ opacity }} />}
                  <span className="relative z-10">{time}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VoteResultTimeList;
