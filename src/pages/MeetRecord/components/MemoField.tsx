import { useRef, useState } from 'react';
import { useAutosizeTextarea } from '@/pages/MeetRecord/hooks/useAutosizeTextarea';
import { colors } from '../../../constants/colors';

type MemoFieldProps = {
  initialMemo: string;
  placeholder: string;
  onMemoChange?: (memo: string) => void;
};

function MemoField({ initialMemo, placeholder, onMemoChange }: MemoFieldProps) {
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
        onChange={(event) => {
          const nextMemo = event.target.value;

          setMemo(nextMemo);
          onMemoChange?.(nextMemo);
        }}
        placeholder={placeholder}
        className="min-h-[20px] w-full resize-none overflow-hidden bg-transparent font-pretendard text-[16px] leading-[20px] outline-none placeholder:text-[#a09583]"
        style={{ color: memo ? colors.text : colors.border }}
        aria-label="메모"
        spellCheck={false}
        rows={1}
      />
    </div>
  );
}

export default MemoField;
