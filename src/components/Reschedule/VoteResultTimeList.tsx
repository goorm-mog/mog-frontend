import { useMemo } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIME_SECTIONS } from '@/constants/time';
import type { RoomMember, ScheduleSlot } from '@/types/schedule';

interface VoteResultTimeListProps {
  slots: ScheduleSlot[];
  totalParticipants: number;
  activeMemberList: RoomMember[];
  activeSlotId: number | null;
  onSlotClick: (slotId: number) => void;
}

function VoteResultTimeList({
  slots,
  totalParticipants,
  activeMemberList,
  activeSlotId,
  onSlotClick,
}: VoteResultTimeListProps) {
  const slotByTime = useMemo(() => Object.fromEntries(slots.map((s) => [s.time, s])), [slots]);

  return (
    <div className="flex flex-col gap-5 pb-10">
      {TIME_SECTIONS.map(({ label, times }) => (
        <div key={label} className="flex flex-col gap-2">
          <span className="text-text text-body2">{label}</span>
          <div className="flex gap-2">
            {times.map((time) => {
              const slot = slotByTime[time];
              const opacity = slot
                ? Math.max(0.15, slot.voteCount / Math.max(totalParticipants, 1))
                : 0;
              const isActive = slot ? activeSlotId === slot.slotId : false;

              return (
                <button
                  key={time}
                  onClick={() => slot && onSlotClick(slot.slotId)}
                  disabled={!slot}
                  className={cn(
                    'relative flex-1 text-center font-pretendard font-medium text-[12px] py-1.5 rounded-sm overflow-hidden',
                    slot
                      ? cn('text-background', isActive && 'ring-1 ring-point ring-inset')
                      : 'border border-dark-border text-dark-border opacity-30',
                  )}
                >
                  {slot && <div className="absolute inset-0 bg-point" style={{ opacity }} />}
                  <span className="relative z-10">{time}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {activeSlotId !== null && activeMemberList.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-3 py-2.5 rounded-lg bg-dark-background/30">
          {activeMemberList.map((m) => (
            <span key={m.userId} className="font-pretendard text-[13px] text-text">
              {m.nickname}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <Info size={12} className="shrink-0 text-dark-border" />
        <span className="font-pretendard text-[11px] text-dark-border">
          시간을 탭하면 해당 시간에 가능한 인원을 확인할 수 있어요
        </span>
      </div>
    </div>
  );
}

export default VoteResultTimeList;
