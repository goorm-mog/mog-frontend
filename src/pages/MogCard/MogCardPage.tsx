import { useNavigate } from 'react-router-dom';
import { Download, Share2, X } from 'lucide-react';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { typography } from '@/constants/typography';
import { useRouteRoomId } from '@/hooks/useRouteRoomId';
import { useToast } from '@/hooks/useToast';
import { saveMogCardImage } from '@/pages/MogCard/api/mogCard';
import MogReceiptCard from '@/pages/MogCard/components/MogReceiptCard';
import { useReceiptPageBackground } from '@/pages/MogCard/hooks/useReceiptPageBackground';
import {
  createReceiptCardPngBlob,
  downloadBlob,
} from '@/pages/MogCard/utils/downloadReceiptCard';
import { useMogCardSummary } from '@/pages/MogCard/hooks/useMogCardSummary';
import { toMogReceipt } from '@/pages/MogCard/utils/mogReceipt';

const RECEIPT_SCREEN_BACKGROUND = '#4d4b48';

function MogCardPage() {
  const navigate = useNavigate();
  const roomId = useRouteRoomId();
  const { showToast } = useToast();
  const receiptCardRef = useRef<HTMLElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { summary, errorMessage, isLoading } = useMogCardSummary(roomId);
  const receipt = useMemo(() => (summary ? toMogReceipt(summary) : null), [summary]);
  const emptyMessage =
    summary && !summary.confirmedDate
      ? '확정 일정이 있는 약속만 모그카드를 만들 수 있어요.'
      : (errorMessage ?? '해당 약속의 영수증을 찾을 수 없습니다.');

  useReceiptPageBackground(RECEIPT_SCREEN_BACKGROUND);

  const createReceiptImageBlob = async () => {
    if (!receipt) {
      throw new Error('공유할 모그카드를 찾을 수 없습니다.');
    }

    const cardWidth = receiptCardRef.current?.getBoundingClientRect().width;

    return createReceiptCardPngBlob(receipt, {
      width: cardWidth ? Math.ceil(cardWidth) : undefined,
    });
  };

  const handleSave = async () => {
    if (!roomId || !receipt || isSaving || isSharing) {
      return;
    }

    setIsSaving(true);

    try {
      const imageBlob = await createReceiptImageBlob();

      downloadBlob(imageBlob, receipt.downloadFileName);
      showToast('모그카드가 저장되었습니다.', 'success');

      try {
        await saveMogCardImage(roomId, imageBlob);
      } catch {
        // 로컬 이미지 저장은 완료되었으므로 서버 업로드 실패는 사용자 흐름을 막지 않습니다.
      }
    } catch {
      showToast('모그카드 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!receipt || isSaving || isSharing) {
      return;
    }

    setIsSharing(true);

    try {
      const previewWindow = !navigator.share ? window.open('', '_blank') : null;
      const imageBlob = await createReceiptImageBlob();
      const imageFile = new File([imageBlob], receipt.downloadFileName, {
        type: 'image/png',
      });
      const shareData: ShareData = {
        files: [imageFile],
      };

      if (!navigator.share) {
        openImagePreview(imageBlob, previewWindow);
        showToast(
          window.isSecureContext
            ? '공유 미지원 브라우저라 이미지를 새 창으로 열었습니다.'
            : '공유 기능은 HTTPS에서만 사용할 수 있어 이미지를 새 창으로 열었습니다.',
          'success',
        );
        return;
      }

      if (navigator.canShare && !navigator.canShare(shareData)) {
        openImagePreview(imageBlob, previewWindow);
        showToast('이미지 공유 미지원 기기라 이미지를 새 창으로 열었습니다.', 'success');
        return;
      }

      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      showToast('모그카드 공유에 실패했습니다.');
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
              label="저장"
              onClick={handleSave}
              disabled={!receipt || isSaving || isSharing}
            >
              <Download size={20} strokeWidth={2.1} />
            </ActionButton>
            <ActionButton
              label="공유"
              onClick={handleShare}
              disabled={!receipt || isSaving || isSharing}
            >
              <Share2 size={20} strokeWidth={2.1} />
            </ActionButton>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <ReceiptStateMessage>영수증을 불러오는 중입니다.</ReceiptStateMessage>
          ) : receipt ? (
            <MogReceiptCard ref={receiptCardRef} receipt={receipt} />
          ) : (
            <ReceiptStateMessage>{emptyMessage}</ReceiptStateMessage>
          )}
        </div>
      </div>
    </main>
  );
}

function openImagePreview(imageBlob: Blob, previewWindow: Window | null) {
  const imageUrl = URL.createObjectURL(imageBlob);

  if (previewWindow) {
    previewWindow.location.href = imageUrl;
  } else {
    window.open(imageUrl, '_blank');
  }

  window.setTimeout(() => URL.revokeObjectURL(imageUrl), 60_000);
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
