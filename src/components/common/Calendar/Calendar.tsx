import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { addDays, addMonths, subMonths } from 'date-fns';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCalendarSelection } from '@/hooks/useCalendarSelection';
import { getCalendarDays, isSameDay } from '@/utils/dateUtils';
import type { CalendarMode } from '@/types/calendar';
import CalendarHeader from './CalendarHeader';
import WeekdayRow from './WeekdayRow';
import DayCell from './DayCell';

interface CalendarProps {
  mode?: CalendarMode;
  availableDates?: Date[];
  dotDates?: Date[];
  onSelectionChange?: (dates: Date[]) => void;
  hintText?: string;
  className?: string;
}

function Calendar({ mode = 'single', availableDates, dotDates, onSelectionChange, hintText, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const {
    selectedDates,
    isClickSelected,
    isInDragRange,
    handleMouseDown,
    handleMouseEnter,
    handleClick,
  } = useCalendarSelection(mode, availableDates);

  const days = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());

  const onSelectionChangeRef = useRef(onSelectionChange);
  useLayoutEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  });

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onSelectionChangeRef.current?.(selectedDates);
  }, [selectedDates]);

  return (
    <div className={cn('w-full select-none bg-dark-background/50 p-4 rounded-xl', className)}>
      <CalendarHeader
        currentDate={currentDate}
        onPrev={() => setCurrentDate((prev) => subMonths(prev, 1))}
        onNext={() => setCurrentDate((prev) => addMonths(prev, 1))}
      />
      <WeekdayRow />
      <div className="grid grid-cols-7">
        {days.map((day) => (
          <DayCell
            key={day.date.toISOString()}
            day={day}
            isSelected={isClickSelected(day.date)}
            prevSelected={isClickSelected(addDays(day.date, -1))}
            nextSelected={isClickSelected(addDays(day.date, 1))}
            isInDragRange={isInDragRange(day.date)}
            prevInDragRange={isInDragRange(addDays(day.date, -1))}
            nextInDragRange={isInDragRange(addDays(day.date, 1))}
            isDisabled={availableDates !== undefined && !availableDates.some((d) => isSameDay(d, day.date))}
            hasDot={dotDates?.some((d) => isSameDay(d, day.date)) ?? false}
            onMouseDown={(shiftKey) => handleMouseDown(day.date, shiftKey)}
            onMouseEnter={(shiftKey) => handleMouseEnter(day.date, shiftKey)}
            onClick={(metaKey) => handleClick(day.date, metaKey)}
          />
        ))}
      </div>
      {hintText && (
        <div className="flex items-start gap-1.5 mt-3 px-1">
          <Info size={12} className="shrink-0 mt-0.5 text-dark-border" />
          <span className="font-dm-mono text-[11px] text-dark-border whitespace-pre-line">
            {hintText}
          </span>
        </div>
      )}
    </div>
  );
}

export default Calendar;
