import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionTitleProps = {
  icon: ReactNode;
  title: string;
  meta: string;
};

function SectionTitle({ icon, title, meta }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'inline-flex size-7 items-center justify-center rounded-full',
          'border border-dark-border bg-dark-background text-text',
        )}
      >
        {icon}
      </span>
      <div className="flex items-baseline gap-2">
        <h2 className="text-[15px] leading-[18px] font-semibold">{title}</h2>
        <span className="text-[12px] leading-[15px] font-medium text-dark-border">{meta}</span>
      </div>
    </div>
  );
}

export default SectionTitle;
