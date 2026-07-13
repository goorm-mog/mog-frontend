import { Check, Cloud } from 'lucide-react';
import { useState, type ButtonHTMLAttributes } from 'react';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type MemberAvatarTone = 'default' | 'point' | 'muted';
type MemberAvatarSize = 'sm' | 'md' | 'lg' | number;
type MemberAvatarBorderWeight = 'thin' | 'bold';
type MemberAvatarBorderStyle = 'solid' | 'dashed';
type MemberAvatarLabelPosition = 'bottom' | 'right';

type MemberAvatarProps = {
  name: string;
  subLabel?: string;
  profileImageUrl?: string | null;
  size?: MemberAvatarSize;
  borderWeight?: MemberAvatarBorderWeight;
  borderStyle?: MemberAvatarBorderStyle;
  selected?: boolean;
  showCheck?: boolean;
  disabled?: boolean;
  tone?: MemberAvatarTone;
  unselectedTone?: MemberAvatarTone;
  labelTone?: MemberAvatarTone;
  labelPosition?: MemberAvatarLabelPosition;
  labelClassName?: string;
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
  subLabel,
  profileImageUrl,
  size = 'md',
  borderWeight = 'thin',
  borderStyle,
  selected = false,
  showCheck = true,
  disabled = false,
  tone = 'default',
  unselectedTone = 'muted',
  labelTone,
  labelPosition = 'bottom',
  labelClassName,
  className = '',
  style,
  ...buttonProps
}: MemberAvatarProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const sizePx = getAvatarSize(size);
  const borderWidth =
    borderWeight === 'bold' ? Math.max(2, sizePx * 0.056) : Math.max(1.5, sizePx * 0.039);
  const avatarColor = disabled ? colors.border : toneColor[selected ? tone : unselectedTone];
  const labelColor = labelTone ? toneColor[labelTone] : avatarColor;
  const isDashed = borderStyle ? borderStyle === 'dashed' : !selected || disabled;

  return (
    <button
      type="button"
      className={`shrink-0 disabled:cursor-not-allowed ${
        labelPosition === 'right' ? 'inline-flex items-center gap-2 text-left' : 'text-center'
      } ${className}`}
      style={{ width: labelPosition === 'bottom' ? sizePx : undefined, ...style }}
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
        {profileImageUrl && failedImageUrl !== profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt=""
            className="h-full w-full rounded-full object-cover"
            onError={() => setFailedImageUrl(profileImageUrl)}
          />
        ) : (
          <Cloud size={sizePx * 0.55} strokeWidth={2} />
        )}
        {showCheck && selected ? (
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
      <span className={`block ${labelPosition === 'bottom' ? 'mt-2' : ''}`}>
        <span
          className={`${labelClassName ?? typography.caption} block truncate`}
          style={{ color: labelColor }}
        >
          {name}
        </span>
        {subLabel ? (
          <span
            className="font-pretendard text-[11px] block truncate"
            style={{ color: toneColor.muted }}
          >
            {subLabel}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export default MemberAvatar;
