import { useState } from 'react';

interface BottomSheetProps {
  children: React.ReactNode;
  ctaLabel: string;
  onCtaClick: () => void;
  ctaDisabled?: boolean;
  isLoading?: boolean;
  caption?: string;
  onExpandedChange?: (expanded: boolean) => void;
}

function BottomSheet({
  children,
  ctaLabel,
  onCtaClick,
  ctaDisabled,
  isLoading,
  caption,
  onExpandedChange,
}: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggle = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    onExpandedChange?.(next);
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-97.5 bg-background z-50">
      <button
        onClick={toggle}
        className="flex justify-center w-full pt-3 pb-5"
        aria-label={isExpanded ? '접기' : '펼치기'}
      >
        <div className="w-10 h-1 rounded-full bg-dark-border/30" />
      </button>

      {isExpanded && (
        <div className="flex gap-3 overflow-x-auto px-6 pb-6 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      )}

      <div className="flex flex-col items-center gap-2 px-6 pb-6">
        <button
          onClick={onCtaClick}
          disabled={ctaDisabled || isLoading}
          className="w-full py-3 rounded-md bg-point text-background font-pretendard font-semibold text-[14px] disabled:opacity-40"
        >
          {isLoading ? '처리 중...' : ctaLabel}
        </button>
        {caption && <span className="font-dm-mono text-[11px] text-dark-border">{caption}</span>}
      </div>
    </div>
  );
}

export default BottomSheet;
