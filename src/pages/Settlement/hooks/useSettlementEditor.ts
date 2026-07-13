import { useCallback, useEffect, useMemo, useState } from 'react';
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
  hasSavedSettlementDraft,
  readSavedSettlementDraft,
  saveSettlementDraft,
} from '@/pages/Settlement/utils/settlementDraftStorage';

type UseSettlementEditorParams = {
  members: SettlementMemberBurden[];
  placePayers: SettlementPlacePayer[];
  roomId: number;
  settlementId: number;
  currentRoomMemberId?: number;
};

function useSettlementEditor({
  members,
  placePayers,
  roomId,
  settlementId,
  currentRoomMemberId,
}: UseSettlementEditorParams) {
  const initialPlaceSettlements = useMemo(
    () => createInitialPlaceSettlements(members, placePayers),
    [members, placePayers],
  );
  const draftStorageKey = useMemo(
    () => getSettlementDraftStorageKey(roomId, settlementId),
    [roomId, settlementId],
  );
  const [placeSettlements, setPlaceSettlements] = useState(() =>
    readSavedSettlementDraft(draftStorageKey, initialPlaceSettlements),
  );
  const [originalPlaceSettlements, setOriginalPlaceSettlements] = useState(
    initialPlaceSettlements,
  );
  const [expandedPlaceIds, setExpandedPlaceIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (hasSavedSettlementDraft(draftStorageKey)) return undefined;

    let ignore = false;

    const applyServerSplitDefaults = async () => {
      try {
        const splitResults = await Promise.all(
          initialPlaceSettlements.map(async (place) => ({
            placeId: place.id,
            splits: await splitSettlementAmount({
              totalAmount: place.targetAmount,
              members: place.participants.map((participant) => participant.name),
            }),
          })),
        );

        if (ignore) return;

        const splitByPlaceId = new Map(
          splitResults.map(({ placeId, splits }) => [placeId, splits.splits]),
        );

        const applySplitAmounts = (places: typeof initialPlaceSettlements) =>
          places.map((place) => {
            const splits = splitByPlaceId.get(place.id);

            if (!splits) return place;

            const amountsByName = splits.reduce<Map<string, number[]>>(
              (amountMap, split) => {
                const amounts = amountMap.get(split.name) ?? [];
                amounts.push(split.amount);
                amountMap.set(split.name, amounts);

                return amountMap;
              },
              new Map(),
            );

            return {
              ...place,
              participants: place.participants.map((participant) => {
                const amounts = amountsByName.get(participant.name) ?? [];
                const amount = amounts.shift();

                return {
                  ...participant,
                  amount: amount ?? participant.amount,
                };
              }),
            };
          });

        setOriginalPlaceSettlements(applySplitAmounts(initialPlaceSettlements));
        setPlaceSettlements((currentPlaces) => applySplitAmounts(currentPlaces));
      } catch {
        // Keep local split defaults when the optional split API is unavailable.
      }
    };

    void applyServerSplitDefaults();

    return () => {
      ignore = true;
    };
  }, [draftStorageKey, initialPlaceSettlements]);

  const originalMySettlementTransfers = useMemo(
    () =>
      calculateMySettlementTransfers(
        originalPlaceSettlements,
        members,
        currentRoomMemberId,
      ),
    [currentRoomMemberId, members, originalPlaceSettlements],
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

  const saveCurrentDraft = useCallback(() => {
    saveSettlementDraft({
      roomId,
      settlementId,
      savedAt: new Date().toISOString(),
      places: placeSettlements,
    });
  }, [placeSettlements, roomId, settlementId]);

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
