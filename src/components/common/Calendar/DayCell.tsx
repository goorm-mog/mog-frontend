import { cn } from '@/lib/utils';
import { getVisualDow, isSameDay } from '@/utils/dateUtils';
import type { CalendarDay } from '@/types/calendar';

interface DayCellProps {
  day: CalendarDay;
  isClickSelected: boolean;
  isInDragRange: boolean;
  dragRange: Date[];
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onClick: (metaKey: boolean) => void;
}

function DayCell({
  day,
  isClickSelected,
  isInDragRange,
  dragRange,
  onMouseDown,
  onMouseEnter,
  onClick,
}: DayCellProps) {
  const visualDow = getVisualDow(day.date);

  const isRangeStart = dragRange.length > 0 && isSameDay(day.date, dragRange[0]);
  const isRangeEnd = dragRange.length > 0 && isSameDay(day.date, dragRange[dragRange.length - 1]);
  const roundedLeft = isRangeStart || visualDow === 0;
  const roundedRight = isRangeEnd || visualDow === 6;

  const textColor = (() => {
    if (isInDragRange || isClickSelected) return 'text-background';
    if (!day.isCurrentMonth) return 'text-dark-border';
    if (day.isToday) return 'text-point';
    return 'text-text';
  })();

  return (
    <div
      className="relative aspect-square flex items-center justify-center cursor-default"
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onClick={(e) => onClick(e.metaKey || e.ctrlKey)}
    >
      {isInDragRange && (
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-[70%] bg-point',
            roundedLeft ? 'left-0 rounded-l-full' : 'left-0',
            roundedRight ? 'right-0 rounded-r-full' : 'right-0',
          )}
        />
      )}

      {isClickSelected && !isInDragRange && (
        <div className="absolute size-[70%] rounded-full bg-point" />
      )}

      <span className={cn('relative z-10 font-dm-mono text-sm', textColor)}>
        {day.date.getDate()}
      </span>
    </div>
  );
}

export default DayCell;
