import { useState, useRef, useEffect } from 'react';
import { isSameDay, getDatesInRange } from '@/utils/dateUtils';
import type { CalendarMode } from '@/types/calendar';

export function useCalendarSelection(mode: CalendarMode = 'single') {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dragRange, setDragRange] = useState<Date[]>([]);

  const dragStartRef = useRef<Date | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const onMouseUp = () => {
      dragStartRef.current = null;
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const handleMouseDown = (date: Date) => {
    if (mode !== 'multiple') return;
    dragStartRef.current = date;
    isDraggingRef.current = false;
    setDragRange([]);
  };

  const handleMouseEnter = (date: Date) => {
    if (mode !== 'multiple') return;
    if (!dragStartRef.current) return;
    if (isSameDay(date, dragStartRef.current)) return;
    isDraggingRef.current = true;
    setSelectedDates([]);
    setDragRange(getDatesInRange(dragStartRef.current, date));
  };

  const handleClick = (date: Date, metaKey: boolean) => {
    if (isDraggingRef.current) return;
    setDragRange([]);
    const isMulti = mode === 'multiple' && metaKey;
    if (isMulti) {
      setSelectedDates((prev) =>
        prev.some((d) => isSameDay(d, date))
          ? prev.filter((d) => !isSameDay(d, date))
          : [...prev, date],
      );
    } else {
      setSelectedDates([date]);
    }
  };

  const isClickSelected = (date: Date) => selectedDates.some((d) => isSameDay(d, date));
  const isInDragRange = (date: Date) => dragRange.some((d) => isSameDay(d, date));

  return {
    selectedDates,
    dragRange,
    isClickSelected,
    isInDragRange,
    handleMouseDown,
    handleMouseEnter,
    handleClick,
  };
}
