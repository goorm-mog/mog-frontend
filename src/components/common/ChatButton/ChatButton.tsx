import type { ButtonHTMLAttributes } from 'react';
import { Bot } from 'lucide-react';
import { colors } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { type ComponentSize, resolveComponentSize } from '@/utils/componentSize';

type ChatButtonProps = {
  size?: ComponentSize;
  width?: ComponentSize;
  height?: ComponentSize;
  iconSize?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const sizeMap = { sm: 40, md: 46, lg: 52 } as const;
const widthMap = { sm: 44, md: 50, lg: 56 } as const;
const heightMap = { sm: 40, md: 46, lg: 52 } as const;

function ChatButton({
  size = 'lg',
  width,
  height,
  iconSize,
  className,
  style,
  type = 'button',
  'aria-label': ariaLabel = '채팅 열기',
  ...props
}: ChatButtonProps) {
  const boxSize = resolveComponentSize(size, sizeMap);
  const buttonWidth =
    width === undefined
      ? resolveComponentSize(size, widthMap)
      : resolveComponentSize(width, widthMap);
  const buttonHeight =
    height === undefined
      ? resolveComponentSize(size, heightMap)
      : resolveComponentSize(height, heightMap);
  const resolvedIconSize = iconSize ?? Math.round(Math.min(buttonWidth, buttonHeight, boxSize) * 0.46);

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md text-background shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition active:scale-[0.98]',
        className,
      )}
      style={{
        width: buttonWidth,
        height: buttonHeight,
        backgroundColor: colors.darkBorder,
        ...style,
      }}
      {...props}
    >
      <Bot size={resolvedIconSize} strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
}

export default ChatButton;
