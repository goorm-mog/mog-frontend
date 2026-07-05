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

export function useMeetRecordReceipts({
  roomId,
  roomMembers,
  initialReceipts,
}: UseMeetRecordReceiptsParams) {
  const storageKey = useMemo(() => getMeetRecordStorageKey(roomId), [roomId]);
  const [receiptCards, setReceiptCards] = useState<ReceiptCardData[]>(() =>
    readSavedReceipts(storageKey, initialReceipts),
  );
  const [pendingScrollReceiptId, setPendingScrollReceiptId] = useState<string | null>(
    null,
  );
  const nextReceiptSeqRef = useRef(getNextReceiptSeq(receiptCards));

  useEffect(() => {
    setReceiptCards(readSavedReceipts(storageKey, initialReceipts));
  }, [initialReceipts, storageKey]);

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
    [],
  );

  const deleteReceipt = useCallback((receiptId: string) => {
    setReceiptCards((currentReceipts) =>
      currentReceipts.filter((receipt) => receipt.roundLabel !== receiptId),
    );
  }, []);

  const addReceipt = useCallback(() => {
    const nextReceipt = createEmptyReceipt(nextReceiptSeqRef.current, roomMembers);
    nextReceiptSeqRef.current += 1;

    setReceiptCards((currentReceipts) => [...currentReceipts, nextReceipt]);
    setPendingScrollReceiptId(nextReceipt.roundLabel);
  }, [roomMembers]);

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
