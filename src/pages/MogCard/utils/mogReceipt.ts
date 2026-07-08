import type {
  MogReceipt,
  MogReceiptPlace,
  SummaryCardResponse,
  SummaryRecordResponse,
} from '@/pages/MogCard/types';

const WON_FORMATTER = new Intl.NumberFormat('ko-KR');
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const RECEIPT_TITLE = 'MOG';
const RECEIPT_FOOTER = '세상의 모든 추억을 모읍니다 • 모그';

const formatWon = (amount: number) => `₩ ${WON_FORMATTER.format(amount)}`;
const formatAmount = (amount: number) => WON_FORMATTER.format(amount);
const formatFileDate = (dateString: string) => dateString.slice(0, 10);

const parseDate = (dateString: string) => {
  if (dateString.includes('T')) {
    return new Date(dateString);
  }

  return new Date(`${dateString}T00:00:00`);
};

const formatReceiptDate = (dateString: string) => {
  const date = parseDate(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (!dateString.includes('T')) {
    return `${year}년 ${month}월 ${day}일 ${WEEKDAYS[date.getDay()]}요일`;
  }

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours < 12 ? '오전' : '오후';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${WEEKDAYS[date.getDay()]}요일 ${meridiem} ${displayHours}:${minutes}`;
};

const formatBarcodeValue = (dateString: string) => {
  const date = parseDate(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}`;
};

const mapReceiptPlaces = (records: SummaryRecordResponse[]): MogReceiptPlace[] =>
  records.map((record) => ({
    id: record.seq,
    placeName: record.placeName,
    address: record.address ?? record.memo ?? '',
    totalCost: formatWon(record.totalCost),
    items: record.participants.map(({ nickname, amount }) => ({
      name: nickname,
      amount: formatAmount(amount),
    })),
  }));

export function toMogReceipt(summary: SummaryCardResponse): MogReceipt | null {
  if (!summary.confirmedDate || summary.records.length === 0) {
    return null;
  }

  return {
    title: RECEIPT_TITLE,
    downloadFileName: `[MOG]room-${summary.roomId}_${formatFileDate(summary.confirmedDate)}.png`,
    participantCount: summary.totalMemberCount,
    participants: summary.members.join(', '),
    datetime: formatReceiptDate(summary.confirmedDate),
    places: mapReceiptPlaces(summary.records),
    totalCost: formatWon(summary.settlement.totalCost),
    photoCount: summary.photos.length,
    representativePhotoUrl: summary.photos[0],
    barcodeValue: formatBarcodeValue(summary.confirmedDate),
    footer: RECEIPT_FOOTER,
  };
}
