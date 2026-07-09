import type { PlaceSettlement } from '@/pages/Settlement/types';

type SavedSettlementDraft = {
  roomId: number;
  settlementId: number;
  savedAt: string;
  places: PlaceSettlement[];
};

export function getSettlementDraftStorageKey(roomId: number, settlementId: number) {
  return `settlement-draft:${roomId}:${settlementId}`;
}

export function readSavedSettlementDraft(
  storageKey: string,
  fallbackPlaces: PlaceSettlement[],
) {
  if (typeof window === 'undefined') {
    return fallbackPlaces;
  }

  const savedDraft = window.localStorage.getItem(storageKey);

  if (!savedDraft) {
    return fallbackPlaces;
  }

  try {
    const parsedDraft = JSON.parse(savedDraft) as Partial<SavedSettlementDraft>;

    return Array.isArray(parsedDraft.places) ? parsedDraft.places : fallbackPlaces;
  } catch {
    return fallbackPlaces;
  }
}

export function hasSavedSettlementDraft(storageKey: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(storageKey) !== null;
}

export function saveSettlementDraft(draft: SavedSettlementDraft) {
  window.localStorage.setItem(
    getSettlementDraftStorageKey(draft.roomId, draft.settlementId),
    JSON.stringify(draft),
  );
}
