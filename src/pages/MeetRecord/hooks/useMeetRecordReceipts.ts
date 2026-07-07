import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createMeetingRecord,
  deleteMeetingRecord,
  fetchMeetingRecords,
  updateMeetingRecord,
} from '@/api/records';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import {
  createEmptyReceipt,
  getNextReceiptSeq,
} from '@/pages/MeetRecord/utils/receiptFactory';
import {
  mapMeetingRecordToReceipt,
  toMeetingRecordRequest,
  type MeetRecordMember,
} from '@/pages/MeetRecord/utils/meetRecordMapper';

type UseMeetRecordReceiptsParams = {
  roomId: number;
  roomMembers: readonly MeetRecordMember[];
  initialReceipts: ReceiptCardData[];
};

export function useMeetRecordReceipts({
  roomId,
  roomMembers,
  initialReceipts,
}: UseMeetRecordReceiptsParams) {
  const [receiptCards, setReceiptCards] = useState<ReceiptCardData[]>(initialReceipts);
  const [deletedRecordIds, setDeletedRecordIds] = useState<number[]>([]);
  const [pendingScrollReceiptId, setPendingScrollReceiptId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const nextReceiptSeqRef = useRef(getNextReceiptSeq(initialReceipts));

  useEffect(() => {
    setReceiptCards(initialReceipts);
    setDeletedRecordIds([]);
    nextReceiptSeqRef.current = getNextReceiptSeq(initialReceipts);
  }, [initialReceipts]);

  const totalAmount = useMemo(
    () => receiptCards.reduce((sum, receipt) => sum + receipt.totalAmount, 0),
    [receiptCards],
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
    setReceiptCards((currentReceipts) => {
      const deletedReceipt = currentReceipts.find(
        (receipt) => receipt.roundLabel === receiptId,
      );

      if (deletedReceipt?.recordId != null) {
        const recordId = deletedReceipt.recordId;
        setDeletedRecordIds((currentIds) => [...currentIds, recordId]);
      }

      return currentReceipts.filter((receipt) => receipt.roundLabel !== receiptId);
    });
  }, []);

  const addReceipt = useCallback(() => {
    const nextReceipt = createEmptyReceipt(nextReceiptSeqRef.current, roomMembers);
    nextReceiptSeqRef.current += 1;

    setReceiptCards((currentReceipts) => [...currentReceipts, nextReceipt]);
    setPendingScrollReceiptId(nextReceipt.roundLabel);
  }, [roomMembers]);

  const refreshReceipts = useCallback(async () => {
    const response = await fetchMeetingRecords(roomId);
    const nextReceipts = response.data.records
      .slice()
      .sort((a, b) => a.seq - b.seq)
      .map((record) => mapMeetingRecordToReceipt(record, roomMembers));

    setReceiptCards(nextReceipts);
    setDeletedRecordIds([]);
    nextReceiptSeqRef.current = getNextReceiptSeq(nextReceipts);
  }, [roomId, roomMembers]);

  const saveReceipts = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const invalidReceipt = receiptCards.find(
        (receipt) =>
          receipt.placeName.trim().length === 0 ||
          receipt.participants.every((participant) => !participant.selected),
      );

      if (invalidReceipt) {
        throw new Error('장소와 참가자를 확인해주세요.');
      }

      for (const recordId of deletedRecordIds) {
        await deleteMeetingRecord(roomId, recordId);
      }

      for (const receipt of receiptCards) {
        const request = toMeetingRecordRequest(receipt);

        if (receipt.recordId == null) {
          await createMeetingRecord(roomId, request);
        } else {
          await updateMeetingRecord(roomId, receipt.recordId, request);
        }
      }

      await refreshReceipts();
      window.alert('저장되었습니다');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '기록 저장 중 오류가 발생했습니다.';
      setSaveError(message);

      try {
        await refreshReceipts();
      } catch {
        setSaveError(`${message} 다시 불러오기에 실패했습니다.`);
      }
    } finally {
      setIsSaving(false);
    }
  }, [deletedRecordIds, receiptCards, refreshReceipts, roomId]);

  const clearPendingScrollReceipt = useCallback(() => {
    setPendingScrollReceiptId(null);
  }, []);

  return {
    receiptCards,
    totalAmount,
    pendingScrollReceiptId,
    isSaving,
    saveError,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    saveReceipts,
    clearPendingScrollReceipt,
  };
}
