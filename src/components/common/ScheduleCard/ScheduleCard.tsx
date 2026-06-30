import type { LucideIcon } from 'lucide-react';
import { Camera } from 'lucide-react';
import Title from '@/components/common/Title/Title';
import { cn } from '@/lib/utils';
import { type ComponentSize, resolveComponentSize } from '@/utils/componentSize';

type ScheduleCardProps = {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  icon?: LucideIcon;
  locationIcon?: LucideIcon;
  size?: ComponentSize;
  className?: string;
};

const paddingMap = { sm: 10, md: 12, lg: 14 } as const;
const iconBoxMap = { sm: 40, md: 48, lg: 56 } as const;

function ScheduleCard({
  title,
  location,
  startTime,
  endTime,
  icon: Icon,
  locationIcon: LocationIcon = Camera,
  size = 'md',
  className,
}: ScheduleCardProps) {
  const padding = resolveComponentSize(size, paddingMap);
  const iconBox = resolveComponentSize(size, iconBoxMap);
  const iconInner = iconBox * 0.42;

  return (
    <article
      className={cn(
        'flex w-full items-stretch overflow-hidden rounded border border-border/30 bg-background',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3" style={{ padding }}>
        <div
          className="grid shrink-0 place-items-center rounded-lg bg-dark-background text-dark-border"
          style={{ width: iconBox, height: iconBox }}
        >
          {Icon ? <Icon size={iconInner} strokeWidth={1.75} /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <Title
            title={title}
            subtitle={{
              text: location,
              icon: LocationIcon,
              iconStrokeWidth: 1.75,
              className: 'truncate',
            }}
          />
        </div>
      </div>

      <div
        className="flex w-24 shrink-0 flex-col items-center justify-center border-l border-dashed border-border/50"
        style={{ padding }}
      >
        <span className="font-dm-mono text-[10px] leading-[15px] text-dark-border">{startTime}</span>
        <span className="my-1 h-3 w-px bg-border/50" />
        <span className="font-dm-mono text-[10px] leading-[15px] text-dark-border">{endTime}</span>
      </div>
    </article>
  );
}

export default ScheduleCard;
