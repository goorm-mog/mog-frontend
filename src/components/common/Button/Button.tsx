import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { type ComponentSize, resolveComponentSize } from '@/utils/componentSize';

type ButtonVariant = 'dark' | 'point';

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ComponentSize;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const heightMap = { sm: 36, md: 44, lg: 52 } as const;
const paddingXMap = { sm: 16, md: 16, lg: 24 } as const;

const variantClass: Record<ButtonVariant, string> = {
  dark: 'bg-text text-background',
  point: 'bg-point text-background',
};

function Button({
  children,
  variant = 'dark',
  size = 'md',
  fullWidth,
  className,
  style,
  type = 'button',
  ...props
}: ButtonProps) {
  const height = resolveComponentSize(size, heightMap);
  const paddingX = resolveComponentSize(size, paddingXMap);
  const isFullWidth = fullWidth ?? size !== 'sm';

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-pretendard text-sm font-medium',
        variantClass[variant],
        className,
      )}
      style={{
        height,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        width: isFullWidth ? '100%' : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
