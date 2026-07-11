import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type JoinGroupSheetProps = {
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (inviteCode: string) => void;
};

function JoinGroupSheet({ isLoading = false, onClose, onSubmit }: JoinGroupSheetProps) {
  const [inviteCode, setInviteCode] = useState('');
  const canSubmit = inviteCode.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isLoading) return;
    onSubmit(inviteCode.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20"
      role="presentation"
      onClick={isLoading ? undefined : onClose}
    >
      <div
        className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-107.5 -translate-x-1/2 flex-col rounded-t-lg border border-border bg-background shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-group-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex w-full justify-center pt-3 pb-2"
          aria-label="닫기"
          disabled={isLoading}
        >
          <div className="h-1 w-10 rounded-full bg-dark-border/30" />
        </button>

        <header className="px-6 pb-3">
          <h2 id="join-group-title" className="text-body text-text">
            코드로 참여
          </h2>
          <p className="mt-1 text-caption text-[#4a463f]">초대 코드를 입력해 주세요</p>
        </header>

        <div className="flex flex-col gap-6 px-6 pb-6">
          <div className="flex flex-col gap-5">
            <span className="text-body text-text">초대 코드</span>
            <div
              className="flex h-12 items-center rounded-[10px] border px-5 shadow-[inset_0_1px_2px_rgba(27,26,18,0.06)]"
              style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
            >
              <input
                type="text"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                placeholder="초대 코드를 입력하세요"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className={`${typography.caption} min-w-0 flex-1 bg-transparent outline-none placeholder:text-border`}
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
            {isLoading ? '참여 중...' : '참여하기'}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default JoinGroupSheet;
