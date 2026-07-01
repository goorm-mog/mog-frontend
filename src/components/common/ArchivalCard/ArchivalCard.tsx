import type { ReactNode } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import Title from '@/components/common/Title/Title';
import { cn } from '@/lib/utils';
import { type ComponentSize, resolveComponentSize } from '@/utils/componentSize';

type ArchivalCardMetaItem = {
  label: string;
  value: string;
};

type ArchivalCardProps = {
  title: string;
  datetime: string;
  location: string;
  totalAmount: string;
  meta?: ArchivalCardMetaItem[];
  size?: ComponentSize;
  className?: string;
  footer?: ReactNode;
};

const paddingMap = { sm: 12, md: 16, lg: 20 } as const;
const metaSizeMap = { sm: 9, md: 10, lg: 11 } as const;
const amountSizeMap = { sm: 14, md: 16, lg: 18 } as const;

function MetaTag({ label, size }: { label: string; size: number }) {
  return (
    <span
      className="rounded border border-dashed border-border bg-background/30 px-[7px] py-[3px] font-pretendard font-medium text-border"
      style={{ fontSize: size, lineHeight: `${size * 1.5}px` }}
    >
      {label}
    </span>
  );
}

function ArchivalCard({
  title,
  datetime,
  location,
  totalAmount,
  meta = [],
  size = 'md',
  className,
  footer,
}: ArchivalCardProps) {
  const padding = resolveComponentSize(size, paddingMap);
  const metaSize = resolveComponentSize(size, metaSizeMap);
  const amountSize = resolveComponentSize(size, amountSizeMap);
  const bodySize = metaSize + 2;

  return (
    <article
      className={cn(
        'w-full rounded border border-border/30 bg-background shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      <div className="flex border-b border-dashed border-border">
        <div className="min-w-0 flex-1" style={{ padding }}>
          <Title
            title={title}
            subtitle={{
              text: datetime,
              icon: Calendar,
              iconStrokeWidth: 2.5,
              className: 'font-dm-mono text-[11px] font-regular',
            }}
            subtitle2={{
              text: location,
              icon: MapPin,
              iconStrokeWidth: 2.5,
              className: 'font-dm-mono text-[11px] font-regular',
            }}
          />
        </div>

        <div
          className="flex w-[120px] shrink-0 flex-col items-center justify-center border-l-2 border-dashed border-border px-2"
          style={{ paddingTop: padding, paddingBottom: padding }}
        >
          <span
            className="font-dm-mono uppercase tracking-[0.5px] text-dark-border"
            style={{ fontSize: metaSize, lineHeight: `${metaSize * 1.5}px` }}
          >
            총 금액
          </span>
          <span
            className="mt-1 text-center font-dm-mono font-medium tracking-[-0.56px] text-point"
            style={{ fontSize: amountSize, lineHeight: `${amountSize * 2.1}px` }}
          >
            {totalAmount}
          </span>
        </div>
      </div>

      {meta.length > 0 || footer ? (
        <div className="flex flex-wrap items-center gap-3" style={{ padding }}>
          {meta.map((item) => (
            <div key={`${item.label}-${item.value}`} className="flex items-center gap-1">
              <MetaTag label={item.label} size={metaSize} />
              <span
                className="font-dm-mono text-text"
                style={{ fontSize: bodySize, lineHeight: `${bodySize * 1.5}px` }}
              >
                {item.value}
              </span>
            </div>
          ))}
          {footer}
        </div>
      ) : null}
    </article>
  );
}

export default ArchivalCard;
