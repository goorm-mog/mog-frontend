import { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCalendarSelection } from '@/hooks/useCalendarSelection';
import { getCalendarDays, isSameDay } from '@/utils/dateUtils';
import type { CalendarAppearance, CalendarMode } from '@/types/calendar';
import CalendarHeader from './CalendarHeader';
import WeekdayRow from './WeekdayRow';
import DayCell from './DayCell';

interface CalendarProps {
  mode?: CalendarMode;
  appearance?: CalendarAppearance;
  markedDates?: Date[];
  initialMonth?: Date;
  defaultSelected?: Date[];
  onSelectionChange?: (dates: Date[]) => void;
  hintText?: string;
  className?: string;
}

function Calendar({
  mode = 'single',
  appearance = 'default',
  markedDates = [],
  initialMonth,
  defaultSelected = [],
  onSelectionChange,
  hintText,
  className,
}: CalendarProps) {
  const isHome = appearance === 'home';

  const [currentDate, setCurrentDate] = useState(() => {
    if (initialMonth) {
      return new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const {
    selectedDates,
    dragRange,
    isClickSelected,
    isInDragRange,
    handleMouseDown,
    handleMouseEnter,
    handleClick,
  } = useCalendarSelection(mode, defaultSelected);

  const days = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());

  const isMarked = (date: Date) => markedDates.some((markedDate) => isSameDay(markedDate, date));

  const handleDayClick = (date: Date, metaKey: boolean) => {
    handleClick(date, metaKey);
    const isMulti = mode === 'multiple' && metaKey;
    const next = isMulti
      ? selectedDates.some((d) => isSameDay(d, date))
        ? selectedDates.filter((d) => !isSameDay(d, date))
        : [...selectedDates, date]
      : [date];
    onSelectionChange?.(next);
  };

  return (
    <div
      className={cn(
        'w-full select-none',
        isHome ? '' : 'rounded-xl bg-dark-background/50 p-4',
        className,
      )}
    >
      <CalendarHeader
        currentDate={currentDate}
        appearance={appearance}
        onPrev={() => setCurrentDate((prev) => subMonths(prev, 1))}
        onNext={() => setCurrentDate((prev) => addMonths(prev, 1))}
      />
      <WeekdayRow />
      <div className={cn('grid grid-cols-7', isHome && 'border-t border-border/50 pt-2')}>
        {days.map((day) => (
          <DayCell
            key={day.date.toISOString()}
            day={day}
            appearance={appearance}
            isMarked={isMarked(day.date)}
            isClickSelected={isClickSelected(day.date)}
            isInDragRange={isInDragRange(day.date)}
            dragRange={dragRange}
            onMouseDown={() => handleMouseDown(day.date)}
            onMouseEnter={() => handleMouseEnter(day.date)}
            onClick={(metaKey) => handleDayClick(day.date, metaKey)}
          />
        ))}
      </div>
      {hintText && (
        <p className="mt-3 flex items-center gap-2 px-1 font-dm-mono text-[11px] text-dark-border">
          <Info size={12} />
          {hintText}
        </p>
      )}
    </div>
  );
}

export default Calendar;
