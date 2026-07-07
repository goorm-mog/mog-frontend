import { useCallback, useMemo, useState } from 'react';
import { splitSettlementAmount } from '@/features/settlement/api/settlement';
import type {
  SettlementMemberBurden,
  SettlementPlacePayer,
} from '@/pages/Settlement/types';
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

type UseSettlementEditorParams = {
  members: SettlementMemberBurden[];
  placePayers: SettlementPlacePayer[];
  roomId: number;
  currentRoomMemberId?: number;
};

function useSettlementEditor({
  members,
  placePayers,
  roomId,
  currentRoomMemberId,
}: UseSettlementEditorParams) {
  const initialPlaceSettlements = useMemo(
    () => createInitialPlaceSettlements(members, placePayers),
    [members, placePayers],
  );
  const originalMySettlementTransfers = useMemo(
    () =>
      calculateMySettlementTransfers(
        initialPlaceSettlements,
        members,
        currentRoomMemberId,
      ),
    [currentRoomMemberId, initialPlaceSettlements, members],
  );
  const draftStorageKey = useMemo(
    () => getSettlementDraftStorageKey(roomId),
    [roomId],
  );
  const [placeSettlements, setPlaceSettlements] = useState(() =>
    readSavedSettlementDraft(draftStorageKey, initialPlaceSettlements),
  );
  const [expandedPlaceIds, setExpandedPlaceIds] = useState<Set<string>>(() => new Set());
  const [redistributingPlaceId, setRedistributingPlaceId] = useState<string | null>(
    null,
  );

  const settlementMembers = useMemo(
    () => calculateMembersFromPlaces(placeSettlements, members),
    [members, placeSettlements],
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
        members,
        currentRoomMemberId,
      ),
    [currentRoomMemberId, members, placeSettlements],
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

  const redistributePlaceEvenly = useCallback(
    async (placeId: string) => {
      const targetPlace = placeSettlements.find((place) => place.id === placeId);

      if (!targetPlace || !targetPlace.included) return;

      try {
        setRedistributingPlaceId(placeId);
        const splitResult = await splitSettlementAmount({
          totalAmount: targetPlace.targetAmount,
          members: targetPlace.participants.map((participant) => participant.name),
        });
        const amountsByName = splitResult.splits.reduce<Map<string, number[]>>(
          (amountMap, split) => {
            const amounts = amountMap.get(split.name) ?? [];
            amounts.push(split.amount);
            amountMap.set(split.name, amounts);

            return amountMap;
          },
          new Map(),
        );

        setPlaceSettlements((currentPlaces) =>
          currentPlaces.map((place) =>
            place.id === placeId
              ? {
                  ...place,
                  participants: place.participants.map((participant) => {
                    const splitAmounts = amountsByName.get(participant.name) ?? [];
                    const amount = splitAmounts.shift();

                    return {
                      ...participant,
                      amount: amount ?? participant.amount,
                    };
                  }),
                }
              : place,
          ),
        );
      } finally {
        setRedistributingPlaceId(null);
      }
    },
    [placeSettlements],
  );

  const saveCurrentDraft = useCallback(() => {
    saveSettlementDraft({
      roomId,
      savedAt: new Date().toISOString(),
      places: placeSettlements,
    });
  }, [placeSettlements, roomId]);

  return {
    placeSettlements,
    expandedPlaceIds,
    settlementMembers,
    allocatedTotalAmount,
    includedPlaceCount,
    remainingAmount,
    mySettlementTransferRows,
    redistributingPlaceId,
    togglePlaceExpanded,
    togglePlaceIncluded,
    updatePlaceParticipantAmount,
    applyPlaceRemainderToMember,
    redistributePlaceEvenly,
    saveCurrentDraft,
  };
}

export default useSettlementEditor;
