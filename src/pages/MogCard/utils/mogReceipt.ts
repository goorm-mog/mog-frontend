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
const formatFileDate = (dateString: string) => dateString.slice(0, 10).replaceAll('-', '');
const sanitizeFileNamePart = (value: string) =>
  value.trim().replace(/[\\/:*?"<>|]/g, '_') || '약속';

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
  records.map((record) => {
    const placeName =
      record.place?.name ?? record.place?.placeName ?? record.placeName ?? '장소 미정';
    const address = record.place?.address ?? record.address ?? record.memo ?? '';
    const items = record.menuItems?.length
      ? record.menuItems.map(({ itemName, totalPrice, price, quantity }) => ({
          name: itemName,
          amount: formatAmount(totalPrice ?? price * quantity),
        }))
      : (record.items?.map(({ name, amount }) => ({
          name,
          amount: formatAmount(amount),
        })) ?? []);

    return {
      id: record.seq,
      placeName,
      address,
      totalCost: formatWon(record.totalCost),
      items,
    };
  });

export function toMogReceipt(summary: SummaryCardResponse): MogReceipt | null {
  if (!summary.confirmedDate || summary.records.length === 0) {
    return null;
  }

  return {
    title: RECEIPT_TITLE,
    downloadFileName: `[MOG] ${sanitizeFileNamePart(summary.roomName ?? '약속')}_${formatFileDate(summary.confirmedDate)}.png`,
    participantCount: summary.totalMemberCount,
    participants: summary.members.join(', '),
    datetime: formatReceiptDate(summary.confirmedDate),
    places: mapReceiptPlaces(summary.records),
    totalCost: formatWon(
      summary.settlement?.totalCost ??
        summary.records.reduce((total, record) => total + record.totalCost, 0),
    ),
    photoCount: summary.photos.length,
    representativePhotoUrl: summary.photos[0],
    barcodeValue: formatBarcodeValue(summary.confirmedDate),
    footer: RECEIPT_FOOTER,
  };
}
