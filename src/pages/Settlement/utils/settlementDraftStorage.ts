import type { PlaceSettlement } from '@/pages/Settlement/types';

type SavedSettlementDraft = {
  roomName: string;
  savedAt: string;
  places: PlaceSettlement[];
};

export function getSettlementDraftStorageKey(roomName: string) {
  return `settlement-draft:${roomName}`;
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

export function saveSettlementDraft(draft: SavedSettlementDraft) {
  window.localStorage.setItem(
    getSettlementDraftStorageKey(draft.roomName),
    JSON.stringify(draft),
  );
}
