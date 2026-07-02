import { useEffect, type RefObject } from 'react';

type UseReceiptAutoScrollParams = {
  scrollRef: RefObject<HTMLElement | null>;
  receiptCount: number;
  receiptId: string | null;
  onScrollComplete: () => void;
};

export function useReceiptAutoScroll({
  scrollRef,
  receiptCount,
  receiptId,
  onScrollComplete,
}: UseReceiptAutoScrollParams) {
  useEffect(() => {
    if (!receiptId) {
      return;
    }

    requestAnimationFrame(() => {
      const scrollElement = scrollRef.current;
      const receiptElement = scrollElement?.querySelector<HTMLElement>(
        `[data-receipt-id="${CSS.escape(receiptId)}"]`,
      );

      if (!scrollElement || !receiptElement) {
        return;
      }

      const scrollElementRect = scrollElement.getBoundingClientRect();
      const receiptElementRect = receiptElement.getBoundingClientRect();
      const receiptTop =
        scrollElement.scrollTop + receiptElementRect.top - scrollElementRect.top;

      scrollElement.scrollTo({
        top: receiptTop,
        behavior: 'smooth',
      });
      onScrollComplete();
    });
  }, [onScrollComplete, receiptCount, receiptId, scrollRef]);
}
