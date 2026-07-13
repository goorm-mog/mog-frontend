import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { type ComponentSize, resolveComponentSize } from '@/utils/componentSize';

type IconButtonProps = {
  children: ReactNode;
  size?: ComponentSize;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const sizeMap = { sm: 32, md: 40, lg: 48 } as const;

function IconButton({
  children,
  size = 'md',
  className,
  type = 'button',
  style,
  ...props
}: IconButtonProps) {
  const boxSize = resolveComponentSize(size, sizeMap);

  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded bg-point text-background shadow-[0px_1px_1px_rgba(0,0,0,0.05)]',
        className,
      )}
      style={{ width: boxSize, height: boxSize, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
