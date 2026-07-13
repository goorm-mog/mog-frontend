import { Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import SelectionCard from '@/components/common/SelectionCard/SelectionCard';
import { TIME_SECTION_MAP } from '@/constants/time';
import type { ScheduleSlot } from '@/features/schedule/types/schedule';

interface TopSlotsContentProps {
  topSlots: ScheduleSlot[];
  activeSlotId: number | null;
  onSlotClick: (slotId: number) => void;
}

function TopSlotsContent({ topSlots, activeSlotId, onSlotClick }: TopSlotsContentProps) {
  return (
    <>
      {topSlots.map((slot) => {
        const formattedDate = format(parseISO(slot.date), 'M월 d일 (EEE)', { locale: ko });
        const section = TIME_SECTION_MAP[slot.time] ?? '';

        return (
          <SelectionCard
            key={slot.slotId}
            icon={Clock}
            title={`${formattedDate} ${section} ${slot.time}`}
            subtitle={`${slot.voteCount}명 가능`}
            isSelected={activeSlotId === slot.slotId}
            onClick={() => onSlotClick(slot.slotId)}
          />
        );
      })}
    </>
  );
}

export default TopSlotsContent;
