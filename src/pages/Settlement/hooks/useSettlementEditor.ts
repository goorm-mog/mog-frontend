import { useCallback, useMemo, useState } from 'react';
import {
  SETTLEMENT_MEMBERS,
  SETTLEMENT_PLACE_PAYERS,
  SETTLEMENT_SUMMARY,
} from '@/pages/Settlement/constants/settlementMockData';
import {
  buildMySettlementTransferRows,
  calculateIncludedTargetAmount,
  calculateMemberTotalAmount,
  calculateMembersFromPlaces,
  calculateMySettlementTransfers,
  calculatePlaceAllocatedAmount,
  createInitialPlaceSettlements,
} from '@/pages/Settlement/utils/settlementCalculator';
import {
  getSettlementDraftStorageKey,
  readSavedSettlementDraft,
  saveSettlementDraft,
} from '@/pages/Settlement/utils/settlementDraftStorage';

function useSettlementEditor() {
  const initialPlaceSettlements = useMemo(
    () => createInitialPlaceSettlements(SETTLEMENT_MEMBERS, SETTLEMENT_PLACE_PAYERS),
    [],
  );
  const originalMySettlementTransfers = useMemo(
    () =>
      calculateMySettlementTransfers(
        initialPlaceSettlements,
        SETTLEMENT_MEMBERS,
        SETTLEMENT_SUMMARY.currentRoomMemberId,
      ),
    [initialPlaceSettlements],
  );
  const draftStorageKey = useMemo(
    () => getSettlementDraftStorageKey(SETTLEMENT_SUMMARY.roomName),
    [],
  );
  const [placeSettlements, setPlaceSettlements] = useState(() =>
    readSavedSettlementDraft(draftStorageKey, initialPlaceSettlements),
  );
  const [expandedPlaceIds, setExpandedPlaceIds] = useState<Set<string>>(() => new Set());

  const settlementMembers = useMemo(
    () => calculateMembersFromPlaces(placeSettlements, SETTLEMENT_MEMBERS),
    [placeSettlements],
  );
  const allocatedTotalAmount = useMemo(
    () =>
      settlementMembers.reduce(
        (membersTotal, member) => membersTotal + calculateMemberTotalAmount(member),
        0,
      ),
    [settlementMembers],
  );
  const includedTargetAmount = useMemo(
    () => calculateIncludedTargetAmount(placeSettlements),
    [placeSettlements],
  );
  const includedPlaceCount = useMemo(
    () => placeSettlements.filter((place) => place.included).length,
    [placeSettlements],
  );
  const remainingAmount = includedTargetAmount - allocatedTotalAmount;
  const currentMySettlementTransfers = useMemo(
    () =>
      calculateMySettlementTransfers(
        placeSettlements,
        SETTLEMENT_MEMBERS,
        SETTLEMENT_SUMMARY.currentRoomMemberId,
      ),
    [placeSettlements],
  );
  const mySettlementTransferRows = useMemo(
    () =>
      buildMySettlementTransferRows(
        currentMySettlementTransfers,
        originalMySettlementTransfers,
      ),
    [currentMySettlementTransfers, originalMySettlementTransfers],
  );

  const togglePlaceExpanded = (placeId: string) => {
    setExpandedPlaceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(placeId)) {
        nextIds.delete(placeId);
      } else {
        nextIds.add(placeId);
      }

      return nextIds;
    });
  };

  const updatePlaceParticipantAmount = (
    placeId: string,
    memberId: number,
    amount: number,
  ) => {
    setPlaceSettlements((currentPlaces) =>
      currentPlaces.map((place) =>
        place.id === placeId
          ? {
              ...place,
              participants: place.participants.map((participant) =>
                participant.memberId === memberId
                  ? {
                      ...participant,
                      amount: Number.isNaN(amount) ? 0 : amount,
                    }
                  : participant,
              ),
            }
          : place,
      ),
    );
  };

  const togglePlaceIncluded = (placeId: string) => {
    setPlaceSettlements((currentPlaces) =>
      currentPlaces.map((place) =>
        place.id === placeId ? { ...place, included: !place.included } : place,
      ),
    );
  };

  const applyPlaceRemainderToMember = (placeId: string, memberId: number) => {
    setPlaceSettlements((currentPlaces) =>
      currentPlaces.map((place) => {
        if (place.id !== placeId || !place.included) return place;

        const remainder = place.targetAmount - calculatePlaceAllocatedAmount(place);

        return {
          ...place,
          participants: place.participants.map((participant) =>
            participant.memberId === memberId
              ? {
                  ...participant,
                  amount: Math.max(0, participant.amount + remainder),
                }
              : participant,
          ),
        };
      }),
    );
  };

  const saveCurrentDraft = useCallback(() => {
    saveSettlementDraft({
      roomName: SETTLEMENT_SUMMARY.roomName,
      savedAt: new Date().toISOString(),
      places: placeSettlements,
    });
  }, [placeSettlements]);

  return {
    placeSettlements,
    expandedPlaceIds,
    settlementMembers,
    allocatedTotalAmount,
    includedPlaceCount,
    remainingAmount,
    mySettlementTransferRows,
    togglePlaceExpanded,
    togglePlaceIncluded,
    updatePlaceParticipantAmount,
    applyPlaceRemainderToMember,
    saveCurrentDraft,
  };
}

export default useSettlementEditor;
