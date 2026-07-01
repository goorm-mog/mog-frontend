import type { ReactNode } from 'react';
import RoughBorder from '../../RoughBorder';
import TextLogo from './TextLogo';
import Step from './Step';
import { cn } from '@/lib/utils';

interface StepHeaderProps {
  className?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  showStep?: boolean;
  children?: ReactNode;
}

function StepHeader({
  className,
  wrapperClassName,
  contentClassName,
  showStep = true,
  children,
}: StepHeaderProps) {
  return (
    <div className={cn('p-4', wrapperClassName)}>
      <RoughBorder
        fill="color-mix(in srgb, var(--color-dark-background) 50%, transparent)"
        containerClassName={className}
        className={contentClassName ?? 'flex flex-col justify-center items-center gap-2'}
      >
        {children ?? <TextLogo />}
        {showStep ? <Step /> : null}
      </RoughBorder>
    </div>
  );
}

export default StepHeader;
