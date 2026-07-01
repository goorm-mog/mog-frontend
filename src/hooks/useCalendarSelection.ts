import { useState, useRef, useEffect } from 'react';
import { isSameDay, getDatesInRange } from '@/utils/dateUtils';
import type { CalendarMode } from '@/types/calendar';

export function useCalendarSelection(mode: CalendarMode = 'single', availableDates?: Date[], defaultSelected?: Date[]) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => defaultSelected ?? []);
  const [dragRange, setDragRange] = useState<Date[]>([]);

  const dragStartRef = useRef<Date | null>(null);
  const isDraggingRef = useRef(false);
  const isShiftDragRef = useRef(false);
  const dragRangeRef = useRef<Date[]>([]);
  const justCommittedDragRef = useRef(false);

  useEffect(() => {
    const onMouseUp = () => {
      if (isDraggingRef.current && dragRangeRef.current.length > 0) {
        const committedRange = [...dragRangeRef.current];
        if (isShiftDragRef.current) {
          setSelectedDates((prev) => {
            const merged = [...prev];
            committedRange.forEach((d) => {
              if (!merged.some((s) => isSameDay(s, d))) merged.push(d);
            });
            return merged;
          });
        } else {
          setSelectedDates(committedRange);
        }
        justCommittedDragRef.current = true;
      }
      setDragRange([]);
      dragRangeRef.current = [];
      dragStartRef.current = null;
      isDraggingRef.current = false;
      isShiftDragRef.current = false;
    };
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const handleMouseDown = (date: Date, shiftKey: boolean) => {
    if (mode !== 'multiple') return;
    dragStartRef.current = date;
    isDraggingRef.current = false;
    isShiftDragRef.current = shiftKey;
    dragRangeRef.current = [];
    setDragRange([]);
  };

  const handleMouseEnter = (date: Date, shiftKey: boolean) => {
    if (mode !== 'multiple') return;
    if (!dragStartRef.current) return;
    if (isSameDay(date, dragStartRef.current)) return;

    // mousedown 이후 shift를 눌러도 shift 드래그로 전환
    if (!isShiftDragRef.current && shiftKey) {
      isShiftDragRef.current = true;
    }

    isDraggingRef.current = true;
    const fullRange = getDatesInRange(dragStartRef.current, date);
    const range = availableDates
      ? fullRange.filter((d) => availableDates.some((a) => isSameDay(a, d)))
      : fullRange;
    dragRangeRef.current = range;
    setDragRange(range);
    if (!isShiftDragRef.current) {
      setSelectedDates([]);
    }
  };

  const handleClick = (date: Date, metaKey: boolean) => {
    if (justCommittedDragRef.current) {
      justCommittedDragRef.current = false;
      return;
    }
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
