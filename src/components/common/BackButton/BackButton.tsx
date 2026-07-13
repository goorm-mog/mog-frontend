import type { ButtonHTMLAttributes } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ComponentSize, resolveComponentSize } from '@/utils/componentSize';

type BackButtonProps = {
  size?: ComponentSize;
  iconSize?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const sizeMap = { sm: 14, md: 16, lg: 20 } as const;

function BackButton({
  size = 'md',
  iconSize,
  className,
  type = 'button',
  'aria-label': ariaLabel = '뒤로가기',
  ...props
}: BackButtonProps) {
  const resolved = resolveComponentSize(size, sizeMap);

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn('inline-flex items-center justify-center bg-transparent p-0 text-text', className)}
      {...props}
    >
      <ArrowLeft size={iconSize ?? resolved} strokeWidth={2} />
    </button>
  );
}

export default BackButton;
