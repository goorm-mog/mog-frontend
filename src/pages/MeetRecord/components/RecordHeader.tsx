import { ArrowUp, ChevronLeft } from 'lucide-react';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type RecordHeaderProps = {
  groupName: string;
};

function RecordHeader({ groupName }: RecordHeaderProps) {
  return (
    <header className="flex h-[100px] shrink-0 items-center justify-between px-[14px] pt-4">
      <button
        type="button"
        className="grid size-[68px] place-items-center rounded-full shadow-[0_12px_34px_rgba(57,48,34,0.14)] transition active:scale-95"
        style={{ backgroundColor: colors.background, color: colors.text }}
        aria-label="뒤로가기"
      >
        <ChevronLeft className="size-10" strokeWidth={2.8} />
      </button>

      <h1 className={typography.head2} style={{ color: colors.text }}>
        {groupName}
      </h1>

      <button
        type="button"
        className="grid size-[68px] place-items-center rounded-full shadow-[0_12px_34px_rgba(214,130,0,0.25)] transition active:scale-95"
        style={{ backgroundColor: colors.point, color: colors.background }}
        aria-label="공유하기"
      >
        <ArrowUp className="size-10" strokeWidth={2.5} />
      </button>
    </header>
  );
}

export default RecordHeader;
