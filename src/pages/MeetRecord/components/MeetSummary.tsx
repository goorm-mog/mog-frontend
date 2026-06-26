import { CalendarDays } from 'lucide-react';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type MeetSummaryProps = {
  title: string;
  dateText: string;
};

function MeetSummary({ title, dateText }: MeetSummaryProps) {
  return (
    <section className="shrink-0 px-5 pb-5 pt-4">
      <div className="flex items-center gap-5">
        <CalendarDays className="size-[64px] shrink-0" strokeWidth={2.5} color={colors.text} />
        <div className="min-w-0">
          <h2 className={`${typography.head2} truncate`} style={{ color: colors.text }}>
            {title}
          </h2>
          <p className={`${typography.body} mt-1`} style={{ color: colors.darkBorder }}>
            {dateText}
          </p>
        </div>
      </div>
    </section>
  );
}

export default MeetSummary;
