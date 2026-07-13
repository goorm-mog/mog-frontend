import { format } from 'date-fns';
import type { GroupDetail, GroupRole } from '@/types/group';
import type { RoomInfo } from '@/types/room';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function mergeRooms(...lists: RoomInfo[][]): RoomInfo[] {
  const byId = new Map<number, RoomInfo>();
  lists.forEach((list) => list.forEach((room) => byId.set(room.roomId, byId.get(room.roomId) ?? room)));
  return [...byId.values()];
}

export function toRoomInfoFromDetail(room: GroupDetail['rooms'][number]): RoomInfo | null {
  const roomId = Number(room.roomId);
  if (!Number.isInteger(roomId) || roomId <= 0) return null;
  return {
    roomId,
    roomName: room.roomName ?? '',
    status: room.status ?? 'VOTING',
    promiseDate: room.promiseDate ?? null,
  };
}

export function parsePromiseDate(promiseDate: string | null): Date | null {
  if (!promiseDate) return null;
  const date = new Date(promiseDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatArchivalDatetime(confirmedDate: string | null): string {
  const date = confirmedDate ? parsePromiseDate(confirmedDate) : null;
  if (!date) return '날짜 미정';
  return `${format(date, 'yyyy.MM.dd')} (${WEEKDAY_LABELS[date.getDay()]}) ${format(date, 'HH:mm')}`;
}

export function formatCurrency(amount: number | null | undefined): string {
  return `₩${(amount ?? 0).toLocaleString('ko-KR')}`;
}

export function roomStatusLabel(status: RoomInfo['status']): string {
  if (status === 'VOTING') return '일정 조율 중';
  if (status === 'RECORDING') return '모임 기록 중';
  return '완료';
}

export function roomDetailPath(room: RoomInfo, role: GroupRole | null): string {
  if (room.status === 'VOTING') {
    return role === 'LEADER'
      ? `/reschedule/host/${room.roomId}`
      : `/reschedule/participant/${room.roomId}`;
  }
  return `/${room.roomId}/meet-detail`;
}
