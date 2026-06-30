import { Plus } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { colors } from '@/constants/colors';

type AddMemberAvatarProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

function AddMemberAvatar({
  className = '',
  'aria-label': ariaLabel = '멤버 추가',
  ...buttonProps
}: AddMemberAvatarProps) {
  return (
    <button
      type="button"
      className={`grid size-[62px] shrink-0 place-items-center rounded-full border-[3px] border-dashed ${className}`}
      style={{ borderColor: colors.border, color: colors.text }}
      aria-label={ariaLabel}
      {...buttonProps}
    >
      <Plus className="size-8" strokeWidth={2.2} />
    </button>
  );
}

export default AddMemberAvatar;
