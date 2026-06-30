import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatYearMonth } from '@/utils/dateUtils';
import type { CalendarAppearance } from '@/types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  appearance?: CalendarAppearance;
  onPrev: () => void;
  onNext: () => void;
}

function CalendarHeader({ currentDate, appearance = 'default', onPrev, onNext }: CalendarHeaderProps) {
  const isHome = appearance === 'home';

  return (
    <div className={cn('flex items-center justify-between px-2', isHome ? 'mb-2' : 'mb-4')}>
      <button type="button" onClick={onPrev} className="cursor-default p-1">
        <ChevronLeft size={isHome ? 12 : 20} strokeWidth={1.5} />
      </button>
      <span
        className={cn(
          'font-dm-mono text-text',
          isHome ? 'text-xl tracking-[2px] uppercase' : 'text-base font-medium',
        )}
      >
        {formatYearMonth(currentDate)}
      </span>
      <button type="button" onClick={onNext} className="cursor-default p-1">
        <ChevronRight size={isHome ? 12 : 20} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default CalendarHeader;
