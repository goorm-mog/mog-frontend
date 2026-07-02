import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReceiptPayerOption } from '@/pages/MeetRecord/types';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type PayerSelectProps = {
  payerText: string;
  options: readonly ReceiptPayerOption[];
  onSelectPayer: (payerText: string) => void;
};

function PayerSelect({ payerText, options, onSelectPayer }: PayerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!selectRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const handleSelect = (payerLabel: string) => {
    onSelectPayer(payerLabel);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between border-b px-3 text-left"
        style={{ borderColor: colors.darkBorder }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={typography.caption} style={{ color: colors.border }}>
          {payerText}
        </span>
        <ChevronDown
          className={`size-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2.5}
          color={colors.text}
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-10 z-20 overflow-hidden rounded-b-[6px] border border-t-0 shadow-[0_8px_18px_rgba(27,26,18,0.12)]"
          style={{
            borderColor: colors.darkBorder,
            backgroundColor: colors.background,
          }}
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={option.label === payerText}
              className={`${typography.caption} block h-10 w-full px-3 text-left transition hover:bg-[rgb(233_227_214_/_0.52)]`}
              style={{ color: colors.border }}
              onClick={() => handleSelect(option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default PayerSelect;
