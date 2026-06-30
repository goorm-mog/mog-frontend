import { cn } from '@/lib/utils';
import { getVisualDow, isSameDay } from '@/utils/dateUtils';
import type { CalendarAppearance, CalendarDay } from '@/types/calendar';

interface DayCellProps {
  day: CalendarDay;
  isClickSelected: boolean;
  isInDragRange: boolean;
  isMarked: boolean;
  appearance: CalendarAppearance;
  dragRange: Date[];
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onClick: (metaKey: boolean) => void;
}

function DayCell({
  day,
  isClickSelected,
  isInDragRange,
  isMarked,
  appearance,
  dragRange,
  onMouseDown,
  onMouseEnter,
  onClick,
}: DayCellProps) {
  const isHome = appearance === 'home';
  const visualDow = getVisualDow(day.date);

  const isRangeStart = dragRange.length > 0 && isSameDay(day.date, dragRange[0]);
  const isRangeEnd = dragRange.length > 0 && isSameDay(day.date, dragRange[dragRange.length - 1]);
  const roundedLeft = isRangeStart || visualDow === 0;
  const roundedRight = isRangeEnd || visualDow === 6;

  const textColor = (() => {
    if (!isHome && (isInDragRange || isClickSelected)) return 'text-background';
    if (isHome && isClickSelected) return 'text-background';
    if (!day.isCurrentMonth) return isHome ? 'text-dark-border/40' : 'text-dark-border';
    if (!isHome && day.isToday) return 'text-point';
    return 'text-text';
  })();

  const showMark = isHome && isMarked && !isClickSelected && !isInDragRange;

  return (
    <div
      className="relative flex aspect-square cursor-default items-center justify-center"
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onClick={(e) => onClick(e.metaKey || e.ctrlKey)}
    >
      {!isHome && isInDragRange && (
        <div
          className={cn(
            'absolute top-1/2 h-[70%] -translate-y-1/2 bg-point',
            roundedLeft ? 'left-0 rounded-l-full' : 'left-0',
            roundedRight ? 'right-0 rounded-r-full' : 'right-0',
          )}
        />
      )}

      {!isHome && isClickSelected && !isInDragRange && (
        <div className="absolute size-[70%] rounded-full bg-point" />
      )}

      {isHome && isClickSelected && !isInDragRange ? (
        <div className="flex size-8 items-center justify-center rounded-xl bg-text">
          <span className={cn('font-dm-mono text-xs', textColor)}>{day.date.getDate()}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-0.5">
          <span className={cn('relative z-10 font-dm-mono', isHome ? 'text-xs' : 'text-sm', textColor)}>
            {day.date.getDate()}
          </span>
          {showMark ? <span className="size-1 rounded-sm bg-[#865300]" /> : null}
        </div>
      )}
    </div>
  );
}

export default DayCell;
