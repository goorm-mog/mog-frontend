import { Check, Cloud } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type MemberAvatarTone = 'default' | 'point' | 'muted';

type MemberAvatarProps = {
  name: string;
  selected?: boolean;
  disabled?: boolean;
  tone?: MemberAvatarTone;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'>;

const toneColor: Record<MemberAvatarTone, string> = {
  default: colors.text,
  point: colors.point,
  muted: colors.border,
};

function MemberAvatar({
  name,
  selected = false,
  disabled = false,
  tone = selected ? 'point' : 'default',
  className = '',
  ...buttonProps
}: MemberAvatarProps) {
  const avatarColor = disabled ? colors.border : toneColor[tone];
  const isDashed = !selected || disabled;

  return (
    <button
      type="button"
      className={`w-[64px] shrink-0 text-center disabled:cursor-not-allowed ${className}`}
      aria-pressed={selected}
      disabled={disabled}
      {...buttonProps}
    >
      <span
        className={`relative mx-auto grid size-[62px] place-items-center rounded-full border-[3px] ${
          isDashed ? 'border-dashed' : ''
        }`}
        style={{
          borderColor: avatarColor,
          backgroundColor: selected ? colors.background : 'transparent',
          color: avatarColor,
        }}
      >
        <Cloud className="size-10" strokeWidth={2.2} />
        {selected ? (
          <span
            className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full"
            style={{ backgroundColor: avatarColor, color: colors.background }}
          >
            <Check className="size-4" strokeWidth={3} />
          </span>
        ) : null}
      </span>
      <span
        className={`${typography.caption} mt-2 block truncate`}
        style={{ color: avatarColor }}
      >
        {name}
      </span>
    </button>
  );
}

export default MemberAvatar;
