import { Check, Cloud } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type MemberAvatarTone = 'default' | 'point' | 'muted';
type MemberAvatarSize = 'sm' | 'md' | 'lg' | number;
type MemberAvatarBorderWeight = 'thin' | 'bold';
type MemberAvatarBorderStyle = 'solid' | 'dashed';

type MemberAvatarProps = {
  name: string;
  size?: MemberAvatarSize;
  borderWeight?: MemberAvatarBorderWeight;
  borderStyle?: MemberAvatarBorderStyle;
  selected?: boolean;
  showCheck?: boolean;
  disabled?: boolean;
  tone?: MemberAvatarTone;
  unselectedTone?: MemberAvatarTone;
  labelTone?: MemberAvatarTone;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'>;

const toneColor: Record<MemberAvatarTone, string> = {
  default: colors.text,
  point: colors.point,
  muted: colors.border,
};

const avatarSize: Record<Exclude<MemberAvatarSize, number>, number> = {
  sm: 36,
  md: 45,
  lg: 56,
};

function getAvatarSize(size: MemberAvatarSize) {
  return typeof size === 'number' ? size : avatarSize[size];
}

function getDashArray(size: number) {
  return `${size * 0.16} ${size * 0.16}`;
}

function MemberAvatar({
  name,
  size = 'md',
  borderWeight = 'thin',
  borderStyle,
  selected = false,
  showCheck = true,
  disabled = false,
  tone = 'default',
  unselectedTone = 'muted',
  labelTone,
  className = '',
  style,
  ...buttonProps
}: MemberAvatarProps) {
  const sizePx = getAvatarSize(size);
  const borderWidth =
    borderWeight === 'bold'
      ? Math.max(2, sizePx * 0.056)
      : Math.max(1.5, sizePx * 0.039);
  const avatarColor = disabled
    ? colors.border
    : toneColor[selected ? tone : unselectedTone];
  const labelColor = labelTone ? toneColor[labelTone] : avatarColor;
  const isDashed = borderStyle
    ? borderStyle === 'dashed'
    : !selected || disabled;

  return (
    <button
      type="button"
      className={`shrink-0 text-center disabled:cursor-not-allowed ${className}`}
      style={{ ...style, width: sizePx }}
      aria-pressed={selected}
      disabled={disabled}
      {...buttonProps}
    >
      <span
        className="relative mx-auto grid place-items-center rounded-full border"
        style={{
          width: sizePx,
          height: sizePx,
          borderWidth: isDashed ? 0 : borderWidth,
          borderColor: avatarColor,
          backgroundColor: selected ? colors.background : 'transparent',
          color: avatarColor,
        }}
      >
        {isDashed ? (
          <svg
            className="pointer-events-none absolute inset-0"
            width={sizePx}
            height={sizePx}
            viewBox={`0 0 ${sizePx} ${sizePx}`}
            aria-hidden="true"
          >
            <circle
              cx={sizePx / 2}
              cy={sizePx / 2}
              r={(sizePx - borderWidth) / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={borderWidth}
              strokeDasharray={getDashArray(sizePx)}
            />
          </svg>
        ) : null}
        <Cloud size={sizePx * 0.55} strokeWidth={2} />
        {selected && showCheck ? (
          <span
            className="absolute grid place-items-center rounded-full"
            style={{
              top: -sizePx * 0.18,
              right: -sizePx * 0.09,
              width: sizePx * 0.44,
              height: sizePx * 0.44,
              backgroundColor: avatarColor,
              color: colors.background,
            }}
          >
            <Check size={sizePx * 0.27} strokeWidth={3} />
          </span>
        ) : null}
      </span>
      <span
        className={`${typography.caption} mt-2 block truncate`}
        style={{ color: labelColor }}
      >
        {name}
      </span>
    </button>
  );
}

export default MemberAvatar;
