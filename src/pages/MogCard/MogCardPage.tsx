import { useNavigate, useParams } from 'react-router-dom';
import { Download, Share2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { typography } from '@/constants/typography';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiFetch';
import { fetchMogCard } from '@/pages/MogCard/api/mogCard';
import MogReceiptCard from '@/pages/MogCard/components/MogReceiptCard';
import {
  createReceiptImageFallbackWindow,
  downloadReceiptImage,
  shareReceiptImage,
} from '@/pages/MogCard/utils/downloadReceiptImage';
import { toMogReceipt } from '@/pages/MogCard/utils/mogReceipt';
import type { SummaryCardResponse } from '@/pages/MogCard/types';

function MogCardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { roomId } = useParams<{ roomId: string }>();
  const receiptRef = useRef<HTMLElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [summary, setSummary] = useState<SummaryCardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const numericRoomId = Number(roomId);
  const receipt = useMemo(() => (summary ? toMogReceipt(summary) : null), [summary]);
  const isProcessing = isDownloading || isSharing;
  const canUseReceiptAction = Boolean(receipt) && !isProcessing && !isLoading;

  useEffect(() => {
    if (!Number.isFinite(numericRoomId)) {
      setSummary(null);
      setErrorMessage('잘못된 약속 정보입니다.');
      setIsLoading(false);
      return;
    }

    let ignore = false;
    setIsLoading(true);
    setErrorMessage(null);

    fetchMogCard(numericRoomId)
      .then((data) => {
        if (!ignore) {
          setSummary(data);
        }
      })
      .catch((error: unknown) => {
        if (ignore) {
          return;
        }

        setSummary(null);
        setErrorMessage(getMogCardErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [numericRoomId]);

  const handleDownload = async () => {
    if (!receiptRef.current || !receipt || isDownloading) {
      return;
    }

    setIsDownloading(true);
    const fallbackWindow = createReceiptImageFallbackWindow();

    try {
      await downloadReceiptImage(
        receiptRef.current,
        getReceiptFileName(receipt.downloadFileName),
        fallbackWindow,
      );
    } catch (error) {
      fallbackWindow?.close();
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

  return (
    <main className="fixed inset-0 overflow-y-auto bg-[rgb(0_0_0_/_70%)] px-[31px] pt-[40px] pb-20">
      <div className="mx-auto w-full max-w-[390px]">
        <div className="mx-auto flex w-full max-w-[370px] items-center justify-between">
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
            <ReceiptStateMessage>
              {errorMessage ?? '해당 약속의 영수증을 찾을 수 없습니다.'}
            </ReceiptStateMessage>
          )}
        </div>
      </div>
    </main>
  );
}

function getMogCardErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'SETTLEMENT_NOT_CONFIRMED') {
      return '정산 확정 후 모그카드를 만들 수 있어요.';
    }

    return error.message;
  }

  return '영수증을 불러오지 못했어요.';
}

function ReceiptStateMessage({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${typography.body2} mx-auto flex min-h-[542px] w-full max-w-[370px] items-center justify-center rounded-[5px] border border-border bg-background px-8 text-center text-dark-border`}
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

function getReceiptFileName(value: string) {
  const fileName = value.trim().replace(/[\\/:*?"<>|]/g, '-');

  return fileName || 'mog';
}

export default MogCardPage;
