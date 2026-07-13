import { useState } from 'react';

interface BottomSheetProps {
  children: React.ReactNode;
  ctaLabel: string;
  onCtaClick: () => void;
  ctaDisabled?: boolean;
  isLoading?: boolean;
  caption?: string;
  sideAction?: React.ReactNode;
  onExpandedChange?: (expanded: boolean) => void;
}

function BottomSheet({
  children,
  ctaLabel,
  onCtaClick,
  ctaDisabled,
  isLoading,
  caption,
  sideAction,
  onExpandedChange,
}: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggle = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    onExpandedChange?.(next);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-107.5 bg-background z-50">
      <button
        type="button"
        onClick={toggle}
        className="flex justify-center w-full pt-3 pb-5"
        aria-label={isExpanded ? '접기' : '펼치기'}
      >
        <div className="w-10 h-1 rounded-full bg-dark-border/30" />
      </button>

      {isExpanded && children != null && (
        <div className="flex gap-3 overflow-x-auto px-6 pb-6 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      )}

      <div className="px-6 pb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCtaClick}
            disabled={ctaDisabled || isLoading}
            className="flex-1 py-3 rounded-md bg-point text-background font-pretendard font-semibold text-[14px] disabled:opacity-40"
          >
            {isLoading ? '처리 중...' : ctaLabel}
          </button>
          {sideAction}
        </div>
        {caption && (
          <p className="text-center mt-2 font-dm-mono text-[11px] text-dark-border">{caption}</p>
        )}
      </div>
    </div>
  );
}

export default BottomSheet;
