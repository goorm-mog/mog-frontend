import { cn } from '@/lib/utils';

export type VoteTabMode = 'individual' | 'group';

interface VoteTabSelectorProps {
  activeTab: VoteTabMode;
  onChange: (tab: VoteTabMode) => void;
}

const TAB_LABELS: Record<VoteTabMode, string> = {
  individual: '날짜별',
  group: '그룹',
};

function VoteTabSelector({ activeTab, onChange }: VoteTabSelectorProps) {
  return (
    <div className="flex gap-2">
      {(['individual', 'group'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'px-4 py-1.5 rounded-full border border-dark-border font-pretendard text-[12px] transition-colors',
            activeTab === tab ? 'bg-dark-border text-background' : 'text-dark-border',
          )}
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}

export default VoteTabSelector;
