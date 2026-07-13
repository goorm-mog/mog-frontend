import { useState } from 'react';
import { Copy, Link2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type InviteGroupSheetProps = {
  groupName: string;
  inviteCode: string;
  kakaoShareUrl: string;
  onClose: () => void;
  onCopied: (target: 'code' | 'link') => void;
};

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Copy command failed');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

function InviteGroupSheet({
  groupName,
  inviteCode,
  kakaoShareUrl,
  onClose,
  onCopied,
}: InviteGroupSheetProps) {
  const [copyingTarget, setCopyingTarget] = useState<'code' | 'link' | null>(null);

  const handleCopy = async (target: 'code' | 'link') => {
    if (copyingTarget) return;
    setCopyingTarget(target);

    try {
      await copyTextToClipboard(target === 'code' ? inviteCode : kakaoShareUrl);
      onCopied(target);
    } finally {
      setCopyingTarget(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-107.5 -translate-x-1/2 flex-col rounded-t-lg border border-border bg-background shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-group-title"
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
          <h2 id="invite-group-title" className="text-body text-text">
            초대 코드 공유
          </h2>
          <p className="mt-1 text-caption text-[#4a463f]">
            <span className="font-medium text-text">{groupName}</span> 초대 코드와 링크를 공유해요
          </p>
        </header>

        <div className="flex flex-col gap-5 px-6 pb-6">
          <div className="flex flex-col gap-3">
            <span className="text-body text-text">초대 코드</span>
            <div
              className="flex h-12 items-center gap-3 rounded-[10px] border px-5 shadow-[inset_0_1px_2px_rgba(27,26,18,0.06)]"
              style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
            >
              <span
                className={`${typography.caption} min-w-0 flex-1 tracking-[0.12em]`}
                style={{ color: colors.text }}
              >
                {inviteCode}
              </span>
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center text-text"
                aria-label="초대 코드 복사"
                disabled={copyingTarget !== null}
                onClick={() => {
                  void handleCopy('code');
                }}
              >
                <Copy size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-body text-text">공유 링크</span>
            <div
              className="flex h-12 items-center gap-3 rounded-[10px] border px-5 shadow-[inset_0_1px_2px_rgba(27,26,18,0.06)]"
              style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
            >
              <span
                className={`${typography.caption} min-w-0 flex-1 truncate`}
                style={{ color: colors.text }}
                title={kakaoShareUrl}
              >
                {kakaoShareUrl}
              </span>
              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center text-text"
                aria-label="공유 링크 복사"
                disabled={copyingTarget !== null}
                onClick={() => {
                  void handleCopy('link');
                }}
              >
                <Link2 size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <footer className="flex gap-3 px-6 pb-6 pt-4">
          <Button
            variant="dark"
            size="lg"
            disabled={copyingTarget !== null}
            onClick={() => {
              void handleCopy('code');
            }}
            className="flex-1"
          >
            {copyingTarget === 'code' ? '복사 중...' : '코드 복사'}
          </Button>
          <Button
            variant="point"
            size="lg"
            disabled={copyingTarget !== null}
            onClick={() => {
              void handleCopy('link');
            }}
            className="flex-1"
          >
            {copyingTarget === 'link' ? '복사 중...' : '링크 복사'}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default InviteGroupSheet;
