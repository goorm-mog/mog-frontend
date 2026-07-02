import type { ReceiptCardData } from '@/pages/MeetRecord/types';

type SavedMeetRecord = {
  roomId: number;
  savedAt: string;
  receipts: ReceiptCardData[];
  totalAmount: number;
};

export function getMeetRecordStorageKey(roomId: number) {
  return `meet-record:${roomId}`;
}

export function readSavedReceipts(
  storageKey: string,
  fallbackReceipts: ReceiptCardData[],
) {
  const savedMeetRecord = window.localStorage.getItem(storageKey);

  if (!savedMeetRecord) {
    return fallbackReceipts;
  }

  try {
    const parsedMeetRecord = JSON.parse(savedMeetRecord) as Partial<SavedMeetRecord>;

    return Array.isArray(parsedMeetRecord.receipts)
      ? parsedMeetRecord.receipts
      : fallbackReceipts;
  } catch {
    return fallbackReceipts;
  }
}

export function saveMeetRecord(record: SavedMeetRecord) {
  window.localStorage.setItem(
    getMeetRecordStorageKey(record.roomId),
    JSON.stringify(record),
  );
}
