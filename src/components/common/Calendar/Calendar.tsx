import { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
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
  onSelectionChange?: (dates: Date[]) => void;
  hintText?: string;
  className?: string;
}

function Calendar({ mode = 'single', onSelectionChange, hintText, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
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
  } = useCalendarSelection(mode);

  const days = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth());

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
        <p className="flex items-center gap-2 mt-3 px-1 font-dm-mono text-[11px] text-dark-border">
          <Info size={12} />
          {hintText}
        </p>
      )}
    </div>
  );
}

export default Calendar;
