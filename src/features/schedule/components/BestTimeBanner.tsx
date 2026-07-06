import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TIME_SECTION_MAP } from '@/constants/time';

interface BestTimeBannerProps {
  date: string;
  time: string;
  voteCount: number;
}

function BestTimeBanner({ date, time, voteCount }: BestTimeBannerProps) {
  const formattedDate = format(parseISO(date), 'M월 d일 (EEE)', { locale: ko });
  const section = TIME_SECTION_MAP[time] ?? '';

  return (
    <div className="flex flex-col gap-1">
      <span className="font-pretendard font-semibold text-[14px] text-text">
        가장 많이 겹치는 시간
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-body text-point">
          {formattedDate} {section} {time}
        </span>
        <span className="text-caption text-dark-border">{voteCount}명 가능</span>
      </div>
    </div>
  );
}

export default BestTimeBanner;
