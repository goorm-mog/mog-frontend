import type { MogReceipt, MogReceiptPlace } from '@/pages/MogCard/types';
import type { MeetingRecordsData, MeetingRecord } from '@/types/records';
import type { RoomDetail } from '@/types/rooms';

const WON_FORMATTER = new Intl.NumberFormat('ko-KR');
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const RECEIPT_TITLE = 'MOG';
const RECEIPT_FOOTER = '세상의 모든 추억을 모읍니다 • 모그';
const PLACE_ADDRESS_BY_SEQ: Record<number, string> = {
  1: '서울시 마포구 합정동 45',
  2: '서울시 마포구 서교동 12',
};

const formatWon = (amount: number) => `₩ ${WON_FORMATTER.format(amount)}`;
const formatAmount = (amount: number) => WON_FORMATTER.format(amount);
const formatFileDate = (dateString: string) => dateString.slice(0, 10);

const formatReceiptDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours < 12 ? '오전' : '오후';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${WEEKDAYS[date.getDay()]}요일 ${meridiem} ${displayHours}:${minutes}`;
};

const formatBarcodeValue = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}`;
};

const getParticipantNames = (meetingRecords: MeetingRecord[]) => {
  const participantNameById = new Map<number, string>();

  meetingRecords.forEach((record) => {
    record.participants.forEach(({ roomMemberId, nickname }) => {
      participantNameById.set(roomMemberId, nickname);
    });
  });

  return [...participantNameById.values()];
};

const sumByRecord = (
  meetingRecords: MeetingRecord[],
  selector: (record: MeetingRecord) => number,
) => meetingRecords.reduce((total, record) => total + selector(record), 0);

const mapReceiptPlaces = (
  meetingRecords: MeetingRecord[],
): MogReceiptPlace[] =>
  meetingRecords.map((record) => ({
    id: record.recordId,
    placeName: record.placeName,
    address: PLACE_ADDRESS_BY_SEQ[record.seq] ?? '-',
    totalCost: formatWon(record.totalCost),
    items: record.participants.map(({ nickname, amount }) => ({
      name: nickname,
      amount: formatAmount(amount),
    })),
  }));

export function createMogReceipt(
  room: RoomDetail,
  recordsData: MeetingRecordsData,
): MogReceipt | null {
  if (recordsData.records.length === 0) {
    return null;
  }

  const participants = getParticipantNames(recordsData.records);
  const totalCost = sumByRecord(recordsData.records, (record) => record.totalCost);

  return {
    title: RECEIPT_TITLE,
    downloadFileName: `[MOG]${room.groupName}_${formatFileDate(room.promiseDate)}.png`,
    participantCount: participants.length,
    participants: participants.join(', '),
    datetime: formatReceiptDate(room.promiseDate),
    places: mapReceiptPlaces(recordsData.records),
    totalCost: formatWon(totalCost),
    photoCount: recordsData.photos.length,
    representativePhotoUrl: recordsData.photos[0]?.s3Url,
    barcodeValue: formatBarcodeValue(room.promiseDate),
    footer: RECEIPT_FOOTER,
  };
}
