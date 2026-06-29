import { WEEKDAY_LABELS } from '@/constants/calendar';

function WeekdayRow() {
  return (
    <div className="grid grid-cols-7 mb-1">
      {WEEKDAY_LABELS.map((label) => (
        <div
          key={label}
          className="flex items-center justify-center font-dm-mono text-[11px] text-text py-1"
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export default WeekdayRow;
