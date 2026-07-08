import { useEffect, useState, type RefObject } from 'react';
import type { MogReceipt } from '@/pages/MogCard/types';
import { createReceiptImageFile } from '@/pages/MogCard/utils/downloadReceiptImage';

const SHARE_FILE_PREPARE_TIMEOUT_MS = 8000;

type ShareFileState = {
  receipt: MogReceipt | null;
  file: File | null;
  isPreparing: boolean;
};

export function useReceiptShareFile(
  receiptRef: RefObject<HTMLElement | null>,
  receipt: MogReceipt | null,
) {
  const [shareState, setShareState] = useState<ShareFileState>({
    receipt: null,
    file: null,
    isPreparing: false,
  });
  const hasCurrentShareState = shareState.receipt === receipt;
  const shareFile = hasCurrentShareState ? shareState.file : null;
  const isPreparingShare = hasCurrentShareState ? shareState.isPreparing : false;

  useEffect(() => {
    if (!receipt || !receiptRef.current) {
      return;
    }

    let ignore = false;
    const receiptElement = receiptRef.current;
    const fileName = getReceiptFileName(receipt.downloadFileName);
    const frameId = window.requestAnimationFrame(() => {
      if (ignore) {
        return;
      }

      setShareState({
        receipt,
        file: null,
        isPreparing: true,
      });

      withTimeout(
        createReceiptImageFile(receiptElement, fileName),
        SHARE_FILE_PREPARE_TIMEOUT_MS,
      )
        .then((file) => {
          if (!ignore) {
            setShareState({
              receipt,
              file,
              isPreparing: false,
            });
          }
        })
        .catch((error: unknown) => {
          console.error(error);
          if (!ignore) {
            setShareState({
              receipt,
              file: null,
              isPreparing: false,
            });
          }
        });
    });

    return () => {
      ignore = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [receipt, receiptRef]);

  return {
    shareFile,
    isPreparingShare,
  };
}

function getReceiptFileName(value: string) {
  const fileName = value.trim().replace(/[\\/:*?"<>|]/g, '-');

  return fileName || 'mog';
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('공유 이미지 준비 시간이 초과됐습니다.'));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => {
        window.clearTimeout(timeoutId);
      });
  });
}
