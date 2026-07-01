import { CheckCheck, X } from 'lucide-react';

interface TimeSectionHeaderProps {
  label: string;
  onSelectAll: () => void;
  onClear: () => void;
}

function TimeSectionHeader({ label, onSelectAll, onClear }: TimeSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-pretendard text-[12px] text-dark-border">{label}</span>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onClear} className="text-dark-border" title="선택 초기화">
          <X size={14} strokeWidth={1.5} />
        </button>
        <button onClick={onSelectAll} className="text-dark-border" title="모든 시간 선택">
          <CheckCheck size={15} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

export default TimeSectionHeader;
