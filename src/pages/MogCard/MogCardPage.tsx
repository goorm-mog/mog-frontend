import { useNavigate, useParams } from 'react-router-dom';
import { Download, Share2, X } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { typography } from '@/constants/typography';
import { useToast } from '@/hooks/useToast';
import MogReceiptCard from '@/pages/MogCard/components/MogReceiptCard';
import {
  createReceiptImageFallbackWindow,
  downloadReceiptImage,
} from '@/pages/MogCard/utils/downloadReceiptImage';
import { getMogReceiptByRoomId } from '@/pages/MogCard/utils/mogReceipt';

function MogCardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { roomId } = useParams<{ roomId: string }>();
  const receiptRef = useRef<HTMLElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const numericRoomId = Number(roomId);
  const receipt = Number.isFinite(numericRoomId)
    ? getMogReceiptByRoomId(numericRoomId)
    : null;
  const canDownload = Boolean(receipt) && !isDownloading;

  const handleDownload = async () => {
    if (!receiptRef.current || !receipt || isDownloading) {
      return;
    }

    setIsDownloading(true);
    const fallbackWindow = createReceiptImageFallbackWindow();

    try {
      await downloadReceiptImage(
        receiptRef.current,
        createSafeFileName(receipt.downloadFileName),
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

  return (
    <main className="fixed inset-0 overflow-y-auto bg-[rgb(0_0_0_/_70%)] px-[31px] pt-[40px] pb-20">
      <div className="mx-auto w-full max-w-[390px]">
        <div className="flex items-center justify-between">
          <ActionButton label="닫기" onClick={() => navigate(-1)}>
            <X size={22} strokeWidth={2.2} />
          </ActionButton>

          <div className="flex items-center gap-3">
            <ActionButton
              label="다운로드"
              onClick={handleDownload}
              disabled={!canDownload}
            >
              <Download size={21} strokeWidth={2.1} />
            </ActionButton>
            <ActionButton label="공유">
              <Share2 size={20} strokeWidth={2.1} />
            </ActionButton>
          </div>
        </div>

        <div className="mt-10">
          {receipt ? (
            <MogReceiptCard ref={receiptRef} receipt={receipt} />
          ) : (
            <div
              className={`${typography.body2} mx-auto flex min-h-[542px] w-full max-w-[370px] items-center justify-center rounded-[5px] border border-border bg-background px-8 text-center text-dark-border`}
            >
              해당 약속의 영수증을 찾을 수 없습니다.
            </div>
          )}
        </div>
      </div>
    </main>
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

function createSafeFileName(value: string) {
  const fileName = value.trim().replace(/[\\/:*?"<>|]/g, '-');

  return fileName || 'mog';
}

export default MogCardPage;
