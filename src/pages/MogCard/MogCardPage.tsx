import { useNavigate, useParams } from 'react-router-dom';
import { Download, Share2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { typography } from '@/constants/typography';
import { useToast } from '@/hooks/useToast';
import MogReceiptCard from '@/pages/MogCard/components/MogReceiptCard';
import { useMogCardSummary } from '@/pages/MogCard/hooks/useMogCardSummary';
import {
  downloadReceiptImage,
  shareReceiptImage,
} from '@/pages/MogCard/utils/downloadReceiptImage';
import { toMogReceipt } from '@/pages/MogCard/utils/mogReceipt';

const RECEIPT_SCREEN_BACKGROUND = '#4d4b48';

function MogCardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { roomId } = useParams<{ roomId: string }>();
  const receiptRef = useRef<HTMLElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
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
  const isProcessing = isDownloading || isSharing;
  const canUseReceiptAction = Boolean(receipt) && !isProcessing && !isLoading;

  useEffect(() => {
    const root = document.getElementById('root');
    const themeColor = getThemeColorMetaElement();
    const previousThemeColor = themeColor.content;
    const previousHtmlBackground = document.documentElement.style.backgroundColor;
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousRootBackground = root?.style.backgroundColor ?? '';

    themeColor.content = RECEIPT_SCREEN_BACKGROUND;
    document.documentElement.style.backgroundColor = RECEIPT_SCREEN_BACKGROUND;
    document.body.style.backgroundColor = RECEIPT_SCREEN_BACKGROUND;

    if (root) {
      root.style.backgroundColor = RECEIPT_SCREEN_BACKGROUND;
    }

    return () => {
      themeColor.content = previousThemeColor;
      document.documentElement.style.backgroundColor = previousHtmlBackground;
      document.body.style.backgroundColor = previousBodyBackground;

      if (root) {
        root.style.backgroundColor = previousRootBackground;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const handleDownload = async () => {
    if (!receiptRef.current || !receipt || isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      const result = await downloadReceiptImage(
        receiptRef.current,
        getReceiptFileName(receipt.downloadFileName),
      );

      if (result.status === 'preview') {
        setPreviewImageUrl((currentUrl) => {
          if (currentUrl) {
            URL.revokeObjectURL(currentUrl);
          }

          return result.objectUrl;
        });
      }
    } catch (error) {
      console.error(error);
      showToast('영수증 이미지를 저장하지 못했어요.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!receiptRef.current || !receipt || isProcessing) {
      return;
    }

    setIsSharing(true);

    try {
      const result = await shareReceiptImage(
        receiptRef.current,
        getReceiptFileName(receipt.downloadFileName),
      );

      if (result === 'downloaded') {
        showToast('공유를 지원하지 않아 이미지로 저장했어요.', 'info');
      }
    } catch (error) {
      console.error(error);
      showToast('영수증 이미지를 공유하지 못했어요.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewImageUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return null;
    });
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
              label="다운로드"
              onClick={handleDownload}
              disabled={!canUseReceiptAction}
            >
              <Download size={21} strokeWidth={2.1} />
            </ActionButton>
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

      {previewImageUrl ? (
        <ReceiptImagePreviewModal
          imageUrl={previewImageUrl}
          fileName={receipt?.downloadFileName ?? 'mog.png'}
          onClose={handleClosePreview}
        />
      ) : null}
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

type ReceiptImagePreviewModalProps = {
  imageUrl: string;
  fileName: string;
  onClose: () => void;
};

function ReceiptImagePreviewModal({
  imageUrl,
  fileName,
  onClose,
}: ReceiptImagePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[rgb(0_0_0_/_78%)] px-4 pt-[calc(18px+env(safe-area-inset-top))] pb-[calc(18px+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-[398px] items-center justify-between">
        <p className="font-pretendard text-[14px] leading-[20px] font-semibold text-background">
          이미지를 길게 눌러 저장하세요.
        </p>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full bg-background text-text"
          aria-label="저장 이미지 닫기"
          onClick={onClose}
        >
          <X size={21} strokeWidth={2.2} />
        </button>
      </div>

      <div className="mx-auto mt-4 min-h-0 w-full max-w-[398px] flex-1 overflow-y-auto">
        <img
          src={imageUrl}
          alt={fileName}
          className="block h-auto w-full select-auto rounded-[2px]"
        />
      </div>
    </div>
  );
}

function getReceiptFileName(value: string) {
  const fileName = value.trim().replace(/[\\/:*?"<>|]/g, '-');

  return fileName || 'mog';
}

function getThemeColorMetaElement() {
  const existingThemeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );

  if (existingThemeColor) {
    return existingThemeColor;
  }

  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  document.head.append(themeColor);

  return themeColor;
}

export default MogCardPage;
