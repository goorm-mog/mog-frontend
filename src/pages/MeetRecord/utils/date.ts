import { meetDateFallback } from '@/pages/MeetRecord/constants/receiptCopy';

type ConfirmedSchedule = {
  date: string;
  time: string;
};

export function formatMeetDate(schedule?: ConfirmedSchedule | null) {
  if (!schedule) {
    return meetDateFallback;
  }

  const time = schedule.time.slice(0, 5);
  const date = new Date(`${schedule.date}T${time}:00`);
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
