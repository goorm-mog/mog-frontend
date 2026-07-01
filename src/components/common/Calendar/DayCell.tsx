import { cn } from '@/lib/utils';
import { getVisualDow } from '@/utils/dateUtils';
import type { CalendarDay } from '@/types/calendar';

interface DayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  prevSelected: boolean;
  nextSelected: boolean;
  isInDragRange: boolean;
  prevInDragRange: boolean;
  nextInDragRange: boolean;
  isDisabled?: boolean;
  hasDot?: boolean;
  onMouseDown: (shiftKey: boolean) => void;
  onMouseEnter: (shiftKey: boolean) => void;
  onClick: (metaKey: boolean) => void;
}

function DayCell({
  day,
  isSelected,
  prevSelected,
  nextSelected,
  isInDragRange,
  prevInDragRange,
  nextInDragRange,
  isDisabled = false,
  hasDot = false,
  onMouseDown,
  onMouseEnter,
  onClick,
}: DayCellProps) {
  const visualDow = getVisualDow(day.date);

  // 드래그 중 range — 인접 날짜 여부로 모서리 결정 (비연속 범위 지원)
  const dragRoundedLeft = !prevInDragRange || visualDow === 0;
  const dragRoundedRight = !nextInDragRange || visualDow === 6;

  // 확정된 선택 range — 인접 날짜 선택 여부로 모서리 결정
  const selRoundedLeft = !prevSelected || visualDow === 0;
  const selRoundedRight = !nextSelected || visualDow === 6;
  const isIsolated = !prevSelected && !nextSelected;

  const textColor = (() => {
    if (isDisabled) return 'text-dark-border/30';
    if (isInDragRange || isSelected) return 'text-background';
    if (!day.isCurrentMonth) return 'text-dark-border';
    if (day.isToday) return 'text-point';
    return 'text-text';
  })();

  return (
    <div
      className={cn(
        'relative aspect-square flex items-center justify-center cursor-default',
        isDisabled && 'pointer-events-none',
      )}
      onMouseDown={(e) => { e.preventDefault(); onMouseDown(e.shiftKey); }}
      onMouseEnter={(e) => onMouseEnter(e.shiftKey)}
      onClick={(e) => onClick(e.metaKey || e.ctrlKey)}
    >
      {isInDragRange && (
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-[70%] bg-point',
            dragRoundedLeft ? 'left-0 rounded-l-full' : 'left-0',
            dragRoundedRight ? 'right-0 rounded-r-full' : 'right-0',
          )}
        />
      )}

      {isSelected && !isInDragRange && (
        isIsolated ? (
          // 고립 날짜 → 원
          <div className="absolute size-[70%] rounded-full bg-point" />
        ) : (
          // 범위 내 → bar
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 h-[70%] bg-point',
              selRoundedLeft ? 'left-0 rounded-l-full' : 'left-0',
              selRoundedRight ? 'right-0 rounded-r-full' : 'right-0',
            )}
          />
        )
      )}

      <span className={cn('relative z-10 font-dm-mono text-sm', textColor)}>
        {day.date.getDate()}
      </span>

      {hasDot && !isSelected && !isInDragRange && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-point z-10" />
      )}
    </div>
  );
}

export default DayCell;
