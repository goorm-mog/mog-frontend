import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import {
  createEmptyReceipt,
  getNextReceiptSeq,
} from '@/pages/MeetRecord/utils/receiptFactory';
import {
  getMeetRecordStorageKey,
  readSavedReceipts,
  saveMeetRecord,
} from '@/pages/MeetRecord/utils/meetRecordStorage';
import type { RoomMember } from '@/types/rooms';

type UseMeetRecordReceiptsParams = {
  roomId: number;
  roomMembers: readonly RoomMember[];
  initialReceipts: ReceiptCardData[];
};

type ReceiptCardsState = {
  initialReceipts: ReceiptCardData[];
  receipts: ReceiptCardData[];
  storageKey: string;
};

export function useMeetRecordReceipts({
  roomId,
  roomMembers,
  initialReceipts,
}: UseMeetRecordReceiptsParams) {
  const storageKey = useMemo(() => getMeetRecordStorageKey(roomId), [roomId]);
  const [receiptCardsState, setReceiptCardsState] = useState<ReceiptCardsState>(() => ({
    initialReceipts,
    receipts: readSavedReceipts(storageKey, initialReceipts),
    storageKey,
  }));
  const [pendingScrollReceiptId, setPendingScrollReceiptId] = useState<string | null>(
    null,
  );
  let receiptCards = receiptCardsState.receipts;

  if (
    receiptCardsState.storageKey !== storageKey ||
    receiptCardsState.initialReceipts !== initialReceipts
  ) {
    receiptCards = readSavedReceipts(storageKey, initialReceipts);
    setReceiptCardsState({ initialReceipts, receipts: receiptCards, storageKey });
  }

  const nextReceiptSeqRef = useRef(getNextReceiptSeq(receiptCards));

  const setReceiptCards = useCallback(
    (
      updater:
        | ReceiptCardData[]
        | ((currentReceipts: ReceiptCardData[]) => ReceiptCardData[]),
    ) => {
      setReceiptCardsState((currentState) => ({
        ...currentState,
        receipts:
          typeof updater === 'function' ? updater(currentState.receipts) : updater,
      }));
    },
    [],
  );

  useEffect(() => {
    nextReceiptSeqRef.current = getNextReceiptSeq(receiptCards);
  }, [receiptCards]);

  const totalAmount = receiptCards.reduce(
    (sum, receipt) => sum + receipt.totalAmount,
    0,
  );

  const updateReceipt = useCallback(
    (receiptId: string, receiptUpdate: Partial<ReceiptCardData>) => {
      setReceiptCards((currentReceipts) =>
        currentReceipts.map((receipt) =>
          receipt.roundLabel === receiptId ? { ...receipt, ...receiptUpdate } : receipt,
        ),
      );
    },
    [setReceiptCards],
  );

  const deleteReceipt = useCallback((receiptId: string) => {
    setReceiptCards((currentReceipts) =>
      currentReceipts.filter((receipt) => receipt.roundLabel !== receiptId),
    );
  }, [setReceiptCards]);

  const addReceipt = useCallback(() => {
    const nextReceipt = createEmptyReceipt(nextReceiptSeqRef.current, roomMembers);
    nextReceiptSeqRef.current += 1;

    setReceiptCards((currentReceipts) => [...currentReceipts, nextReceipt]);
    setPendingScrollReceiptId(nextReceipt.roundLabel);
  }, [roomMembers, setReceiptCards]);

  const saveReceipts = useCallback(() => {
    saveMeetRecord({
      roomId,
      savedAt: new Date().toISOString(),
      receipts: receiptCards,
      totalAmount,
    });
    window.alert('저장되었습니다');
  }, [receiptCards, roomId, totalAmount]);

  const clearPendingScrollReceipt = useCallback(() => {
    setPendingScrollReceiptId(null);
  }, []);

  return {
    receiptCards,
    totalAmount,
    pendingScrollReceiptId,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    saveReceipts,
    clearPendingScrollReceipt,
  };
}
