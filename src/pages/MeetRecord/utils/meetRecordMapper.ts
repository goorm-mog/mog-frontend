import type { CreateMeetingRecordRequest, MeetingRecord, RecordMenuItem } from '@/types/records';
import { receiptCopy } from '@/pages/MeetRecord/constants/receiptCopy';
import type {
  ReceiptCardData,
  ReceiptItem,
  ReceiptPayerOption,
  ReceiptParticipant,
} from '@/pages/MeetRecord/types';
import { normalizeReceiptItemsTotal } from '@/pages/MeetRecord/utils/receipt';

export type MeetRecordMember = {
  roomMemberId: number;
  nickname: string;
};

const TOTAL_ITEM_NAME = '총액';

export function mapMeetingRecordToReceipt(
  record: MeetingRecord,
  roomMembers: readonly MeetRecordMember[],
): ReceiptCardData {
  const participantIds = new Set(record.participants.map(({ roomMemberId }) => roomMemberId));

  return {
    recordId: record.recordId,
    roundLabel: `${record.seq}차`,
    placeName: record.place.name,
    placeAddress: record.place.address,
    placePlaceholder: receiptCopy.placePlaceholder,
    menuPlaceholder: receiptCopy.menuPlaceholder,
    items:
      record.menuItems && record.menuItems.length > 0
        ? normalizeReceiptItemsTotal(record.menuItems.map(toReceiptItem), record.totalCost)
        : createFallbackItems(record.totalCost),
    totalAmount: record.totalCost,
    participants: roomMembers.map(({ roomMemberId, nickname }) => ({
      id: roomMemberId,
      name: nickname,
      selected: participantIds.has(roomMemberId),
      disabled: !participantIds.has(roomMemberId),
    })),
    payerPlaceholder: record.payer ? formatPayerLabel(record.payer) : receiptCopy.payerPlaceholder,
    payerRoomMemberId: record.payer?.roomMemberId ?? null,
    payerBankName: record.payer?.bankName ?? null,
    payerAccountNumber: record.payer?.accountNumber ?? null,
    memo: record.memo ?? '',
    memoPlaceholder: receiptCopy.memoPlaceholder,
  };
}

export function toPayerOptions(roomMembers: readonly MeetRecordMember[]): ReceiptPayerOption[] {
  return roomMembers.map(({ roomMemberId, nickname }) => ({
    id: roomMemberId,
    label: nickname,
  }));
}

export function toMeetingRecordRequest(receipt: ReceiptCardData): CreateMeetingRecordRequest {
  const selectedParticipants = receipt.participants.filter((participant) => participant.selected);

  return {
    place: {
      name: receipt.placeName.trim(),
      address: receipt.placeAddress?.trim() || null,
    },
    menuItems: receipt.items.filter((item) => item.name.trim().length > 0).map(toRecordMenuItem),
    memo: receipt.memo.trim(),
    payer:
      receipt.payerRoomMemberId == null
        ? null
        : {
            roomMemberId: receipt.payerRoomMemberId,
            bankName: receipt.payerBankName?.trim() || null,
            accountNumber: receipt.payerAccountNumber?.trim() || null,
          },
    participants: splitAmount(receipt.totalAmount, selectedParticipants),
  };
}

function toReceiptItem(item: RecordMenuItem) {
  return {
    name: item.itemName,
    count: item.quantity,
    price: item.price,
  };
}

function createFallbackItems(totalCost: number) {
  return totalCost > 0 ? [{ name: TOTAL_ITEM_NAME, count: 1, price: totalCost }] : [];
}

function toRecordMenuItem(item: ReceiptItem): RecordMenuItem {
  return {
    itemName: item.name.trim(),
    quantity: item.count,
    price: item.price,
  };
}

function splitAmount(totalAmount: number, participants: readonly ReceiptParticipant[]) {
  if (participants.length === 0) {
    return [];
  }

  const baseAmount = Math.floor(totalAmount / participants.length);
  const remainder = totalAmount % participants.length;

  return participants.map((participant, index) => ({
    roomMemberId: participant.id,
    amount: baseAmount + (index < remainder ? 1 : 0),
  }));
}

function formatPayerLabel(payer: { nickname: string }) {
  return payer.nickname;
}
