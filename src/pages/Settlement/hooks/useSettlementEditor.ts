import { useMemo, useState } from 'react';
import {
  buildMySettlementTransferRows,
  calculateIncludedTargetAmount,
  calculateMemberTotalAmount,
  calculateMembersFromPlaces,
  calculatePlaceAllocatedAmount,
  createInitialPlaceSettlements,
} from '@/pages/Settlement/utils/settlementCalculator';

function useSettlementEditor() {
  const [placeSettlements, setPlaceSettlements] = useState(createInitialPlaceSettlements);
  const [expandedPlaceIds, setExpandedPlaceIds] = useState<Set<string>>(() => new Set());

  const settlementMembers = useMemo(
    () => calculateMembersFromPlaces(placeSettlements),
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
  const mySettlementTransferRows = useMemo(
    () => buildMySettlementTransferRows(placeSettlements),
    [placeSettlements],
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
  };
}

export default useSettlementEditor;
