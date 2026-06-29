export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type CalendarMode = 'single' | 'multiple';
