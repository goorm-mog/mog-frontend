import * as React from 'react';
import { OTPInputContext } from 'input-otp';
import { InputOTP, InputOTPGroup } from '@/components/shadcn/input-otp';
import { cn } from '@/lib/utils';

function CodeSlot({ index }: { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-active={isActive}
      className={cn(
        'text-head2 relative flex aspect-[3/4] w-[calc((100%-50px)/6)] items-center justify-center rounded-md border border-background bg-white/40 text-center font-light',
        char ? 'text-text' : 'text-text/30',
        isActive && 'ring-1 ring-border',
      )}
    >
      {char || '0'}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-6 w-px bg-text duration-1000" />
        </div>
      )}
    </div>
  );
}

type ParticipationCodeInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

function ParticipationCodeInput({ value, onChange, className }: ParticipationCodeInputProps) {
  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={onChange}
      containerClassName={cn('w-full', className)}
      inputMode="numeric"
      pattern="[0-9]*"
    >
      <InputOTPGroup className="w-full justify-between gap-0 border-none bg-transparent shadow-none">
        {Array.from({ length: 6 }).map((_, index) => (
          <CodeSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

export default ParticipationCodeInput;
