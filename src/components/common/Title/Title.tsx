import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubtitleItem {
  text: string;
  icon?: LucideIcon;
  iconStrokeWidth?: number;
  className?: string;
}

interface TitleProps {
  title: string;
  subtitle?: SubtitleItem;
  subtitle2?: SubtitleItem;
  icon?: LucideIcon;
  iconStrokeWidth?: number;
}

function Title({ title, subtitle, subtitle2, icon: Icon, iconStrokeWidth }: TitleProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={16} strokeWidth={iconStrokeWidth} />}
        <div className="text-body text-text">{title}</div>
      </div>
      {subtitle && (
        <div
          className={cn(
            'flex items-center gap-1 text-caption text-[12px] text-dark-border',
            subtitle.className,
          )}
        >
          {subtitle.icon && <subtitle.icon size={12} strokeWidth={subtitle.iconStrokeWidth} />}
          {subtitle.text}
        </div>
      )}
      {subtitle2 && (
        <div
          className={cn(
            'flex items-center gap-1 text-caption text-[12px] text-dark-border',
            subtitle2.className,
          )}
        >
          {subtitle2.icon && <subtitle2.icon size={12} strokeWidth={subtitle2.iconStrokeWidth} />}
          {subtitle2.text}
        </div>
      )}
    </div>
  );
}

export default Title;
