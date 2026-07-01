import { cn } from '@/lib/utils';

interface SelectionCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  isSelected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

function SelectionCard({
  icon: Icon,
  title,
  subtitle,
  isSelected,
  onClick,
  children,
  className,
}: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col gap-3 text-left bg-background rounded-2xl p-4 border transition-colors',
        'w-[calc(100vw-72px)] max-w-72 shrink-0',
        isSelected ? 'border-point' : 'border-dark-border/30',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icon size={16} className="shrink-0 text-point" />
          <span className="font-pretendard font-semibold text-[15px] text-point leading-tight">
            {title}
          </span>
        </div>
        <span className="font-pretendard text-[13px] text-dark-border">{subtitle}</span>
      </div>

      <div className="border-t border-dashed border-dark-border/40 pt-3 w-full">
        {children}
      </div>
    </button>
  );
}

export default SelectionCard;
