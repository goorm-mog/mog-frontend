import { Plus } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { colors } from '@/constants/colors';

type AddMemberAvatarSize = 'sm' | 'md' | 'lg' | number;
type AddMemberAvatarBorderWeight = 'thin' | 'bold';

type AddMemberAvatarProps = {
  size?: AddMemberAvatarSize;
  borderWeight?: AddMemberAvatarBorderWeight;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

const avatarSize: Record<Exclude<AddMemberAvatarSize, number>, number> = {
  sm: 36,
  md: 45,
  lg: 56,
};

function getAvatarSize(size: AddMemberAvatarSize) {
  return typeof size === 'number' ? size : avatarSize[size];
}

function getDashArray(size: number) {
  return `${size * 0.16} ${size * 0.16}`;
}

function AddMemberAvatar({
  size = 'md',
  borderWeight = 'thin',
  className = '',
  'aria-label': ariaLabel = '멤버 추가',
  style,
  ...buttonProps
}: AddMemberAvatarProps) {
  const sizePx = getAvatarSize(size);
  const borderWidth =
    borderWeight === 'bold'
      ? Math.max(2, sizePx * 0.056)
      : Math.max(1.5, sizePx * 0.039);

  return (
    <button
      type="button"
      className={`relative grid shrink-0 place-items-center rounded-full ${className}`}
      style={{
        ...style,
        width: sizePx,
        height: sizePx,
        borderWidth: 0,
        color: colors.text,
      }}
      aria-label={ariaLabel}
      {...buttonProps}
    >
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
          stroke={colors.border}
          strokeWidth={borderWidth}
          strokeDasharray={getDashArray(sizePx)}
        />
      </svg>
      <Plus color={colors.text} size={sizePx * 0.53} strokeWidth={2.2} />
    </button>
  );
}

export default AddMemberAvatar;
