import { ArrowLeft, Save } from 'lucide-react';

type SettlementHeaderProps = {
  onBack: () => void;
  onSave: () => void;
};

function SettlementHeader({ onBack, onSave }: SettlementHeaderProps) {
  return (
    <header className="grid min-h-[50px] grid-cols-[1fr_auto_1fr] items-center bg-background px-4 pt-[7px] pb-2">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="기록으로 이동"
          className="inline-flex items-center gap-1.5 bg-transparent p-0 text-text"
          onClick={onBack}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          <span className="whitespace-nowrap text-[10px] leading-[12px] font-medium text-dark-border">
            기록으로 이동
          </span>
        </button>
      </div>

      <h1 className="font-noto-serif text-[28px] leading-[34px] font-semibold text-text">정산</h1>

      <div className="flex items-center justify-end">
        <button
          type="button"
          aria-label="중간 저장"
          className="inline-flex size-6 items-center justify-center bg-transparent p-0 text-text"
          onClick={onSave}
        >
          <Save size={17} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

export default SettlementHeader;
