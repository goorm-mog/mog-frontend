import { useNavigate, useParams } from 'react-router-dom';
import { Share2, X } from 'lucide-react';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { typography } from '@/constants/typography';
import { useToast } from '@/hooks/useToast';
import MogReceiptCard from '@/pages/MogCard/components/MogReceiptCard';
import { useReceiptPageBackground } from '@/pages/MogCard/hooks/useReceiptPageBackground';
import { useReceiptShareFile } from '@/pages/MogCard/hooks/useReceiptShareFile';
import { useMogCardSummary } from '@/pages/MogCard/hooks/useMogCardSummary';
import {
  ReceiptImageShareUnsupportedError,
  shareReceiptImageFile,
} from '@/pages/MogCard/utils/downloadReceiptImage';
import { toMogReceipt } from '@/pages/MogCard/utils/mogReceipt';

const RECEIPT_SCREEN_BACKGROUND = '#4d4b48';

function MogCardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { roomId } = useParams<{ roomId: string }>();
  const receiptRef = useRef<HTMLElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const numericRoomId = Number(roomId);
  const isValidRoomId = Number.isFinite(numericRoomId);
  const { summary, errorMessage, isLoading } = useMogCardSummary(
    numericRoomId,
    isValidRoomId,
  );
  const receipt = useMemo(() => (summary ? toMogReceipt(summary) : null), [summary]);
  const emptyMessage =
    summary && !summary.confirmedDate
      ? '확정 일정이 있는 약속만 모그카드를 만들 수 있어요.'
      : (errorMessage ?? '해당 약속의 영수증을 찾을 수 없습니다.');
  const { shareFile, isPreparingShare } = useReceiptShareFile(receiptRef, receipt);
  const canUseReceiptAction =
    Boolean(shareFile) && !isSharing && !isLoading && !isPreparingShare;

  useReceiptPageBackground(RECEIPT_SCREEN_BACKGROUND);

  const handleShare = async () => {
    if (!shareFile || isSharing) {
      if (!isPreparingShare) {
        showToast('공유 이미지를 준비하지 못했어요.');
      }
      return;
    }

    setIsSharing(true);

    try {
      await shareReceiptImageFile(shareFile);
    } catch (error) {
      console.error(error);
      showToast(
        error instanceof ReceiptImageShareUnsupportedError
          ? '이 브라우저에서는 이미지 공유를 지원하지 않아요.'
          : '영수증 이미지를 공유하지 못했어요.',
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <main
      className="relative min-h-dvh px-4 pt-[calc(40px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))]"
      style={{ backgroundColor: RECEIPT_SCREEN_BACKGROUND }}
    >
      <div
        className="pointer-events-none fixed inset-x-0 top-[calc(-1*env(safe-area-inset-top))] bottom-[calc(-1*env(safe-area-inset-bottom))] z-0"
        style={{ backgroundColor: RECEIPT_SCREEN_BACKGROUND }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-[calc(10px+env(safe-area-inset-top))] bg-gradient-to-b from-[#4d4b48] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[calc(34px+env(safe-area-inset-bottom))] bg-gradient-to-t from-[#4d4b48] to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto w-full max-w-[430px]">
        <div className="mx-auto flex w-full max-w-[398px] items-center justify-between">
          <ActionButton label="닫기" onClick={() => navigate(-1)}>
            <X size={22} strokeWidth={2.2} />
          </ActionButton>

          <div className="flex items-center gap-3">
            <ActionButton
              label="공유"
              onClick={handleShare}
              disabled={!canUseReceiptAction}
            >
              <Share2 size={20} strokeWidth={2.1} />
            </ActionButton>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <ReceiptStateMessage>영수증을 불러오는 중입니다.</ReceiptStateMessage>
          ) : receipt ? (
            <MogReceiptCard ref={receiptRef} receipt={receipt} />
          ) : (
            <ReceiptStateMessage>{emptyMessage}</ReceiptStateMessage>
          )}
        </div>
      </div>
    </main>
  );
}

function ReceiptStateMessage({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${typography.body2} mx-auto flex min-h-[542px] w-full max-w-[398px] items-center justify-center rounded-[5px] border border-border bg-background px-8 text-center text-dark-border`}
    >
      {children}
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
};

function ActionButton({
  label,
  onClick,
  disabled,
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className="flex size-11 items-center justify-center rounded-full bg-background text-text shadow-[0_2px_8px_rgb(0_0_0_/_18%)] disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default MogCardPage;
