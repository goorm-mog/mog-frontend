import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatYearMonth } from '@/utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

function CalendarHeader({ currentDate, onPrev, onNext }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 mb-4">
      <button type="button" onClick={onPrev} className="p-1 cursor-default">
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <span className="font-dm-mono text-base font-medium text-text">
        {formatYearMonth(currentDate)}
      </span>
      <button type="button" onClick={onNext} className="p-1 cursor-default">
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default CalendarHeader;
