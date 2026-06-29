import {
  startOfWeek,
  eachDayOfInterval,
  addDays,
  isSameMonth,
  isToday,
  getDay,
  format,
} from 'date-fns';
import type { CalendarDay } from '@/types/calendar';

export type { CalendarDay } from '@/types/calendar';

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const gridStart = startOfWeek(firstDay, { weekStartsOn: 1 });
  const gridEnd = addDays(gridStart, 41);

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, firstDay),
    isToday: isToday(date),
  }));
}

export function getDatesInRange(start: Date, end: Date): Date[] {
  const from = start <= end ? start : end;
  const to = start <= end ? end : start;
  return eachDayOfInterval({ start: from, end: to });
}

export function getVisualDow(date: Date): number {
  return (getDay(date) + 6) % 7;
}

export function formatYearMonth(date: Date): string {
  return format(date, 'yyyy.MM');
}

export { isSameDay } from 'date-fns';
