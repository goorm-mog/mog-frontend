import { Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import SelectionCard from '@/components/common/SelectionCard/SelectionCard';
import { TIME_SECTION_MAP } from '@/constants/time';
import type { RoomMember, ScheduleSlot } from '@/types/schedule';

interface TopSlotsContentProps {
  topSlots: ScheduleSlot[];
  members: RoomMember[];
  activeSlotId: number | null;
  onSlotClick: (slotId: number) => void;
}

function TopSlotsContent({ topSlots, members, activeSlotId, onSlotClick }: TopSlotsContentProps) {
  return (
    <>
      {topSlots.map((slot) => {
        const formattedDate = format(parseISO(slot.date), 'M월 d일 (EEE)', { locale: ko });
        const section = TIME_SECTION_MAP[slot.time] ?? '';
        const memberNames = slot.votedUserIds
          .map((uid) => members.find((m) => m.userId === uid)?.nickname)
          .filter((name): name is string => Boolean(name))
          .join(', ');

        return (
          <SelectionCard
            key={slot.slotId}
            icon={Clock}
            title={`${formattedDate} ${section} ${slot.time}`}
            subtitle={`${slot.voteCount}명 가능`}
            isSelected={activeSlotId === slot.slotId}
            onClick={() => onSlotClick(slot.slotId)}
          >
            <span className="font-pretendard text-[13px] text-dark-border">{memberNames}</span>
          </SelectionCard>
        );
      })}
    </>
  );
}

export default TopSlotsContent;
