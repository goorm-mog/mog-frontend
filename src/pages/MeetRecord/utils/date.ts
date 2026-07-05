import { meetDateFallback } from '@/pages/MeetRecord/constants/receiptCopy';
import type { ConfirmScheduleResponse } from '@/types/schedule';

export function formatMeetDate(schedule?: ConfirmScheduleResponse | null) {
  if (!schedule) {
    return meetDateFallback;
  }

  const date = new Date(`${schedule.date}T${schedule.time}:00`);
  const dateText = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
  const timeText = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${dateText}  ${timeText}`;
}
