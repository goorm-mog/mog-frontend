import { CalendarPlus } from 'lucide-react';
import IconButton from '@/components/common/IconButton/IconButton';
import { cn } from '@/lib/utils';
import type { HomeTab } from '@/pages/Home/constants/homeMockData';

const TABS: { id: HomeTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'calendar', label: '캘린더' },
  { id: 'list', label: '리스트' },
];

type HomeTabNavProps = {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
  onAddClick?: () => void;
};

function HomeTabNav({ activeTab, onTabChange, onAddClick }: HomeTabNavProps) {
  return (
    <div className="relative flex items-center justify-center px-4 py-6">
      <div className="flex items-center gap-2">
        {TABS.map((tab, index) => (
          <div key={tab.id} className="flex items-center gap-2">
            <button
              type="button"
              className="relative px-3 py-2"
              onClick={() => onTabChange(tab.id)}
            >
              <span
                className={cn(
                  'text-xs',
                  activeTab === tab.id ? 'font-medium text-[#865300]' : 'text-[#4a463f]',
                )}
              >
                {tab.label}
              </span>
              {activeTab === tab.id ? (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 bg-[#865300]" />
              ) : null}
            </button>
            {index < TABS.length - 1 ? (
              <span className="text-base text-dark-border/30" aria-hidden>
                |
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <IconButton
        className="absolute right-4"
        aria-label="약속 만들기"
        onClick={onAddClick}
      >
        <CalendarPlus size={20} strokeWidth={2} />
      </IconButton>
    </div>
  );
}

export default HomeTabNav;
