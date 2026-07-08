import { useCallback, useMemo, useRef, useState } from 'react';
import {
  createMeetingRecord,
  deleteMeetingRecord,
  deleteRoomPhoto,
  fetchMeetingRecords,
  updateMeetingRecord,
  uploadRoomPhoto,
} from '@/api/records';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import type { RoomRecordPhoto } from '@/types/records';
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
  initialPhotos: RoomRecordPhoto[];
};

export function useMeetRecordReceipts({
  roomId,
  roomMembers,
  initialReceipts,
  initialPhotos,
}: UseMeetRecordReceiptsParams) {
  const [receiptCards, setReceiptCards] = useState<ReceiptCardData[]>(initialReceipts);
  const [savedReceiptCards, setSavedReceiptCards] =
    useState<ReceiptCardData[]>(initialReceipts);
  const [roomPhotos, setRoomPhotos] = useState<RoomRecordPhoto[]>(initialPhotos);
  const [deletedRecordIds, setDeletedRecordIds] = useState<number[]>([]);
  const [pendingScrollReceiptId, setPendingScrollReceiptId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [receiptsVersion, setReceiptsVersion] = useState(0);
  const nextReceiptSeqRef = useRef(getNextReceiptSeq(initialReceipts));

  const totalAmount = useMemo(
    () => receiptCards.reduce((sum, receipt) => sum + receipt.totalAmount, 0),
    [receiptCards],
  );
  const hasUnsavedChanges = useMemo(
    () =>
      deletedRecordIds.length > 0 ||
      JSON.stringify(receiptCards) !== JSON.stringify(savedReceiptCards),
    [deletedRecordIds.length, receiptCards, savedReceiptCards],
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
    setSavedReceiptCards(nextReceipts);
    setRoomPhotos(response.data.photos);
    setDeletedRecordIds([]);
    nextReceiptSeqRef.current = getNextReceiptSeq(nextReceipts);
    setReceiptsVersion((version) => version + 1);
  }, [roomId, roomMembers]);

  const uploadPhotos = useCallback(
    async (files: File[]) => {
      if (files.length === 0) {
        return;
      }

      if (roomId <= 0) {
        throw new Error('올바른 약속 ID가 없습니다.');
      }

      const remainingCount = Math.max(0, 3 - roomPhotos.length);
      const filesToUpload = files.slice(0, remainingCount);

      if (filesToUpload.length === 0) {
        throw new Error('사진은 최대 3장까지 업로드할 수 있습니다.');
      }

      for (const file of filesToUpload) {
        const response = await uploadRoomPhoto(roomId, file);
        setRoomPhotos((currentPhotos) => [...currentPhotos, response.data]);
      }
    },
    [roomId, roomPhotos.length],
  );

  const deletePhoto = useCallback(
    async (photoId: number) => {
      if (roomId <= 0) {
        throw new Error('올바른 약속 ID가 없습니다.');
      }

      await deleteRoomPhoto(roomId, photoId);
      setRoomPhotos((currentPhotos) =>
        currentPhotos.filter((photo) => photo.photoId !== photoId),
      );
    },
    [roomId],
  );

  const saveReceipts = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    let didStartServerMutation = false;

    try {
      if (roomId <= 0) {
        throw new Error('올바른 약속 ID가 없습니다.');
      }

      const invalidReceipt = receiptCards.find(
        (receipt) =>
          receipt.placeName.trim().length === 0 ||
          receipt.participants.every((participant) => !participant.selected) ||
          receipt.payerRoomMemberId == null ||
          !receipt.payerBankName?.trim() ||
          !receipt.payerAccountNumber?.trim(),
      );

      if (invalidReceipt) {
        throw new Error('장소, 참가자, 정산자와 계좌 정보를 확인해주세요.');
      }

      didStartServerMutation = true;

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

      if (!didStartServerMutation) {
        return;
      }

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
    roomPhotos,
    receiptsVersion,
    hasUnsavedChanges,
    totalAmount,
    pendingScrollReceiptId,
    isSaving,
    saveError,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    uploadPhotos,
    deletePhoto,
    saveReceipts,
    clearPendingScrollReceipt,
  };
}
