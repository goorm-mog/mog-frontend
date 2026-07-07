import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export type GroupNameSheetMode = 'create' | 'edit';

type CreateRoomSheetProps = {
  mode?: GroupNameSheetMode;
  initialName?: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

function CreateRoomSheet({
  mode = 'create',
  initialName = '',
  isLoading = false,
  onClose,
  onSubmit,
}: CreateRoomSheetProps) {
  const [name, setName] = useState(initialName);
  const canSubmit = name.trim().length > 0;

  const title = mode === 'create' ? '방 만들기' : '방 이름 수정';
  const submitLabel = mode === 'create' ? '만들기' : '저장';

  const handleSubmit = () => {
    if (!canSubmit || isLoading) return;
    onSubmit(name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-97.5 -translate-x-1/2 flex-col rounded-t-lg border border-border bg-background shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-room-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex w-full justify-center pt-3 pb-2"
          aria-label="닫기"
        >
          <div className="h-1 w-10 rounded-full bg-dark-border/30" />
        </button>

        <header className="px-6 pb-3">
          <h2 id="create-room-title" className="text-body text-text">
            {title}
          </h2>
          {mode === 'create' ? (
            <p className="mt-1 text-caption text-[#4a463f]">새로운 모임을 만들어요</p>
          ) : null}
        </header>

        <div className="flex flex-col gap-6 px-6 pb-6">
          <div className="flex flex-col gap-5">
            <span className="text-body text-text">방 이름</span>
            <div
              className="flex h-12 items-center rounded-[10px] border px-5 shadow-[inset_0_1px_2px_rgba(27,26,18,0.06)]"
              style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
            >
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="방 이름을 입력하세요"
                className={`${typography.caption} min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#a09583]`}
                style={{ color: colors.text }}
              />
            </div>
          </div>
        </div>

        <footer className="flex gap-3 px-6 pb-6 pt-4">
          <Button variant="dark" size="lg" onClick={onClose} disabled={isLoading} className="flex-1">
            취소
          </Button>
          <Button
            variant="point"
            size="lg"
            disabled={!canSubmit || isLoading}
            onClick={handleSubmit}
            className="flex-1"
          >
            {isLoading ? '처리 중...' : submitLabel}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default CreateRoomSheet;
