import { useRef, useState } from 'react';
import { useAutosizeTextarea } from '@/pages/MeetRecord/hooks/useAutosizeTextarea';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type MemoFieldProps = {
  initialMemo: string;
};

function MemoField({ initialMemo }: MemoFieldProps) {
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const [memo, setMemo] = useState(initialMemo);

  useAutosizeTextarea(memoRef, memo);

  return (
    <div
      className="flex min-h-11 items-center rounded-[10px] border px-5 py-3"
      style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
    >
      <textarea
        ref={memoRef}
        value={memo}
        onChange={(event) => setMemo(event.target.value)}
        className={`${typography.caption} min-h-[17px] w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-[#a09583]`}
        style={{ color: colors.border }}
        aria-label="메모"
        spellCheck={false}
        rows={1}
      />
    </div>
  );
}

export default MemoField;
