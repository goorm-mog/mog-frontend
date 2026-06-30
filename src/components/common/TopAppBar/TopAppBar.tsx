import type { ReactNode } from 'react';
import { Bell, Menu } from 'lucide-react';
import BackButton from '@/components/common/BackButton/BackButton';
import { cn } from '@/lib/utils';
import { type ComponentSize, resolveComponentSize } from '@/utils/componentSize';

type TopAppBarProps = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
  hasNotificationBadge?: boolean;
  size?: ComponentSize;
  className?: string;
  rightSlot?: ReactNode;
};

const heightMap = { sm: 44, md: 50, lg: 56 } as const;
const titleSizeMap = { sm: 24, md: 28, lg: 32 } as const;
const iconSizeMap = { sm: 14, md: 16, lg: 18 } as const;

function TopAppBar({
  title = 'MOG',
  showBack = false,
  onBack,
  onNotificationClick,
  onMenuClick,
  hasNotificationBadge = false,
  size = 'md',
  className,
  rightSlot,
}: TopAppBarProps) {
  const height = resolveComponentSize(size, heightMap);
  const titleSize = resolveComponentSize(size, titleSizeMap);
  const iconSize = resolveComponentSize(size, iconSizeMap);

  return (
    <header
      className={cn('flex w-full items-center justify-between bg-background px-4', className)}
      style={{ minHeight: height, paddingTop: 7, paddingBottom: 8 }}
    >
      <div className="flex min-w-0 flex-1 items-center">
        {showBack ? <BackButton size={size} iconSize={iconSize} onClick={onBack} /> : null}
      </div>

      <div className="shrink-0">
        <h1
          className="font-noto-serif font-semibold tracking-[-0.7px] text-text"
          style={{ fontSize: titleSize, lineHeight: `${titleSize * 1.2}px` }}
        >
          {title}
        </h1>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        {rightSlot ?? (
          <>
            <button
              type="button"
              className="relative inline-flex items-center justify-center bg-transparent p-0 text-text"
              onClick={onNotificationClick}
              aria-label="알림"
            >
              <Bell size={iconSize + 4} strokeWidth={2} />
              {hasNotificationBadge ? (
                <span className="absolute -top-0.5 right-0 size-1.5 rounded-full bg-[#865300]" />
              ) : null}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center bg-transparent p-0 text-text"
              onClick={onMenuClick}
              aria-label="메뉴"
            >
              <Menu size={iconSize + 2} strokeWidth={2} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default TopAppBar;
