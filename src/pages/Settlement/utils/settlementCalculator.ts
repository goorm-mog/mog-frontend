import {
  SETTLEMENT_MEMBERS,
  SETTLEMENT_PLACE_PAYERS,
  SETTLEMENT_SUMMARY,
} from '@/pages/Settlement/constants/settlementMockData';
import type {
  PlaceSettlement,
  SettlementMemberBurden,
  SettlementTransfer,
  SettlementTransferRow,
} from '@/pages/Settlement/types';

export const calculateMemberTotalAmount = (member: SettlementMemberBurden) =>
  member.details.reduce((total, detail) => total + detail.amount, 0);

export const calculateEvenShareAmounts = (
  targetAmount: number,
  participantCount: number,
) => {
  if (participantCount === 0) return [];

  const baseAmount = Math.trunc(targetAmount / participantCount);

  return Array.from({ length: participantCount }, () => baseAmount);
};

export const createInitialPlaceSettlements = (): PlaceSettlement[] => {
  const placesByName = new Map<string, PlaceSettlement>();
  const payerByPlaceName = new Map<string, (typeof SETTLEMENT_PLACE_PAYERS)[number]>(
    SETTLEMENT_PLACE_PAYERS.map((payer) => [payer.placeName, payer]),
  );

  for (const member of SETTLEMENT_MEMBERS) {
    for (const detail of member.details) {
      const payer = payerByPlaceName.get(detail.placeName);
      const place =
        placesByName.get(detail.placeName) ??
        {
          id: detail.placeName,
          placeName: detail.placeName,
          payerId: payer?.payerId ?? null,
          payerName: payer?.payerName ?? '-',
          targetAmount: 0,
          included: true,
          participants: [],
        };

      place.targetAmount += detail.amount;
      place.participants.push({
        memberId: member.id,
        name: member.name,
        amount: 0,
      });
      placesByName.set(detail.placeName, place);
    }
  }

  return Array.from(placesByName.values()).map((place) => {
    const evenShareAmounts = calculateEvenShareAmounts(
      place.targetAmount,
      place.participants.length,
    );

    return {
      ...place,
      participants: place.participants.map((participant, index) => ({
        ...participant,
        amount: evenShareAmounts[index] ?? 0,
      })),
    };
  });
};

export const calculatePlaceAllocatedAmount = (place: PlaceSettlement) =>
  place.participants.reduce((total, participant) => total + participant.amount, 0);

export const filterIncludedPlaces = (places: PlaceSettlement[]) =>
  places.filter((place) => place.included);

export const calculateIncludedTargetAmount = (places: PlaceSettlement[]) =>
  filterIncludedPlaces(places).reduce((total, place) => total + place.targetAmount, 0);

export const calculateMembersFromPlaces = (
  places: PlaceSettlement[],
): SettlementMemberBurden[] =>
  SETTLEMENT_MEMBERS.map((member) => ({
    ...member,
    details: filterIncludedPlaces(places)
      .filter((place) =>
        place.participants.some((participant) => participant.memberId === member.id),
      )
      .map((place) => {
        const participant = place.participants.find(
          (item) => item.memberId === member.id,
        );

        return {
          id: `${member.id}-${place.id}`,
          placeName: place.placeName,
          amount: participant?.amount ?? 0,
        };
      }),
  }));

export const calculateMySettlementTransfers = (
  places: PlaceSettlement[],
): SettlementTransfer[] => {
  const memberById = new Map(SETTLEMENT_MEMBERS.map((member) => [member.id, member]));
  const currentMemberId = SETTLEMENT_SUMMARY.currentRoomMemberId;
  const currentMember = currentMemberId ? memberById.get(currentMemberId) : undefined;
  const balancesByCounterparty = new Map<
    number,
    {
      signedAmount: number;
      breakdown: SettlementTransfer['breakdown'];
    }
  >();

  for (const place of places) {
    if (!place.included) continue;

    for (const participant of place.participants) {
      if (
        place.payerId === null ||
        participant.memberId === place.payerId ||
        participant.amount <= 0
      ) {
        continue;
      }
      if (currentMemberId === undefined) {
        continue;
      }

      const isCurrentUserSender = participant.memberId === currentMemberId;
      const isCurrentUserReceiver = place.payerId === currentMemberId;
      if (!isCurrentUserSender && !isCurrentUserReceiver) continue;

      const counterpartyId = isCurrentUserSender ? place.payerId : participant.memberId;
      const currentBalance = balancesByCounterparty.get(counterpartyId) ?? {
        signedAmount: 0,
        breakdown: [],
      };
      const direction = isCurrentUserSender ? 'send' : 'receive';

      balancesByCounterparty.set(counterpartyId, {
        signedAmount:
          currentBalance.signedAmount +
          (direction === 'receive' ? participant.amount : -participant.amount),
        breakdown: [
          ...currentBalance.breakdown,
          {
            placeName: place.placeName,
            direction,
            amount: participant.amount,
          },
        ],
      });
    }
  }

  return Array.from(balancesByCounterparty.entries())
    .map(([counterpartyId, balance]) => {
      const counterparty = memberById.get(counterpartyId);
      const direction: SettlementTransfer['direction'] =
        balance.signedAmount >= 0 ? 'receive' : 'send';
      const amount = Math.abs(balance.signedAmount);
      const receiver = direction === 'receive' ? currentMember : counterparty;

      return {
        id: `net-${counterpartyId}`,
        transferKey: `net-${counterpartyId}`,
        from: direction === 'send' ? currentMember?.name ?? '-' : counterparty?.name ?? '-',
        to: direction === 'send' ? counterparty?.name ?? '-' : currentMember?.name ?? '-',
        amount,
        bankText: receiver?.bankText ?? '-',
        accountText: receiver?.accountText ?? '-',
        direction,
        breakdown: balance.breakdown,
      };
    })
    .filter((transfer) => transfer.amount > 0);
};

const ORIGINAL_MY_SETTLEMENT_TRANSFERS = calculateMySettlementTransfers(
  createInitialPlaceSettlements(),
);

export const buildMySettlementTransferRows = (
  places: PlaceSettlement[],
): SettlementTransferRow[] => {
  const currentTransfers = calculateMySettlementTransfers(places);
  const currentTransferByKey = new Map(
    currentTransfers.map((transfer) => [transfer.transferKey, transfer]),
  );
  const originalTransferByKey = new Map(
    ORIGINAL_MY_SETTLEMENT_TRANSFERS.map((transfer) => [transfer.transferKey, transfer]),
  );

  return [
    ...currentTransfers.map((transfer) => {
      const originalAmount = originalTransferByKey.get(transfer.transferKey)?.amount ?? 0;

      return {
        transfer,
        originalAmount,
        amountDelta: transfer.amount - originalAmount,
        isRemoved: false,
      };
    }),
    ...ORIGINAL_MY_SETTLEMENT_TRANSFERS
      .filter((transfer) => !currentTransferByKey.has(transfer.transferKey))
      .map((transfer) => ({
        transfer: {
          ...transfer,
          id: `${transfer.transferKey}-removed`,
          amount: 0,
        },
        originalAmount: transfer.amount,
        amountDelta: -transfer.amount,
        isRemoved: true,
      })),
  ];
};
