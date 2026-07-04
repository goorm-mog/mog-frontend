import { ArrowLeft } from 'lucide-react';

type SettlementHeaderProps = {
  onBack: () => void;
};

function SettlementHeader({ onBack }: SettlementHeaderProps) {
  return (
    <header className="grid min-h-[50px] grid-cols-[1fr_auto_1fr] items-center bg-background px-4 pt-[7px] pb-2">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="뒤로가기"
          className="inline-flex size-6 items-center justify-center bg-transparent p-0 text-text"
          onClick={onBack}
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
      </div>

      <h1 className="font-noto-serif text-[28px] leading-[34px] font-semibold text-text">정산</h1>

      <div aria-hidden />
    </header>
  );
}

export default SettlementHeader;
