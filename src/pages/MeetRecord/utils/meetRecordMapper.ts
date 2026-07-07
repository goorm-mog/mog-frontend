import type {
  CreateMeetingRecordRequest,
  MeetingRecord,
} from '@/types/records';
import { receiptCopy } from '@/pages/MeetRecord/constants/receiptCopy';
import type {
  ReceiptCardData,
  ReceiptPayerOption,
  ReceiptParticipant,
} from '@/pages/MeetRecord/types';

export type MeetRecordMember = {
  roomMemberId: number;
  nickname: string;
  bankName?: string | null;
  accountNumber?: string | null;
};

const TOTAL_ITEM_NAME = '총액';

export function mapMeetingRecordToReceipt(
  record: MeetingRecord,
  roomMembers: readonly MeetRecordMember[],
): ReceiptCardData {
  const participantIds = new Set(
    record.participants.map(({ roomMemberId }) => roomMemberId),
  );

  return {
    recordId: record.recordId,
    roundLabel: `${record.seq}차`,
    placeName: record.placeName,
    placePlaceholder: receiptCopy.placePlaceholder,
    menuPlaceholder: receiptCopy.menuPlaceholder,
    items:
      record.totalCost > 0
        ? [{ name: TOTAL_ITEM_NAME, count: 1, price: record.totalCost }]
        : [],
    totalAmount: record.totalCost,
    participants: roomMembers.map(({ roomMemberId, nickname }) => ({
      id: roomMemberId,
      name: nickname,
      selected: participantIds.has(roomMemberId),
    })),
    payerPlaceholder: record.payer ? formatPayerLabel(record.payer) : receiptCopy.payerPlaceholder,
    payerRoomMemberId: record.payer?.roomMemberId ?? null,
    payerBankName: record.payer?.bankName ?? null,
    payerAccountNumber: record.payer?.accountNumber ?? null,
    memo: record.memo ?? '',
    memoPlaceholder: receiptCopy.memoPlaceholder,
    photoCount: 0,
  };
}

export function toPayerOptions(
  roomMembers: readonly MeetRecordMember[],
): ReceiptPayerOption[] {
  return roomMembers.map(({ roomMemberId, nickname, bankName, accountNumber }) => ({
    id: roomMemberId,
    label: formatMemberLabel({ nickname, bankName, accountNumber }),
    bankName,
    accountNumber,
  }));
}

export function toMeetingRecordRequest(
  receipt: ReceiptCardData,
): CreateMeetingRecordRequest {
  const selectedParticipants = receipt.participants.filter(
    (participant) => participant.selected,
  );

  return {
    placeName: receipt.placeName.trim(),
    memo: receipt.memo.trim(),
    payer:
      receipt.payerRoomMemberId == null
        ? null
        : {
            roomMemberId: receipt.payerRoomMemberId,
            bankName: receipt.payerBankName ?? null,
            accountNumber: receipt.payerAccountNumber ?? null,
          },
    participants: splitAmount(receipt.totalAmount, selectedParticipants),
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

function formatPayerLabel(payer: {
  nickname: string;
  bankName?: string | null;
  accountNumber?: string | null;
}) {
  return formatMemberLabel(payer);
}

function formatMemberLabel(member: {
  nickname: string;
  bankName?: string | null;
  accountNumber?: string | null;
}) {
  if (member.bankName && member.accountNumber) {
    return `${member.nickname}(${member.bankName} : ${member.accountNumber})`;
  }

  return member.nickname;
}
