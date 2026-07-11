import { apiFetch } from '@/lib/apiFetch';
import type {
  RoomCreateApiResponse,
  RoomCreateBody,
  RoomCreateData,
  RoomInfo,
  RoomListApiResponse,
  RoomSummaryApiResponse,
  RoomStatus,
} from '@/types/room';

function toRoomId(value: unknown): number | null {
  const roomId = Number(value);
  return Number.isInteger(roomId) && roomId > 0 ? roomId : null;
}

function normalizeRoom(
  room: RoomInfo & { id?: number; room_id?: number },
): RoomInfo | null {
  const roomId = toRoomId(room.roomId) ?? toRoomId(room.id) ?? toRoomId(room.room_id);
  if (roomId === null) return null;

  return {
    roomId,
    roomName: room.roomName ?? '',
    status: (room.status as RoomStatus | undefined) ?? 'VOTING',
    promiseDate: room.promiseDate ?? null,
  };
}

export async function createRoom(groupId: number, body: RoomCreateBody): Promise<RoomCreateData> {
  const response = await apiFetch<RoomCreateApiResponse>(`/api/v1/groups/${groupId}/rooms`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const data = response.data as (RoomCreateData & { id?: number }) | null | undefined;
  const roomId = toRoomId(data?.roomId) ?? toRoomId(data?.id);

  if (!data || roomId === null) {
    throw new Error('방 생성 응답에 roomId가 없어요');
  }

  return {
    ...data,
    roomId,
  };
}

export async function fetchGroupRooms(groupId: number): Promise<RoomInfo[]> {
  const response = await apiFetch<RoomListApiResponse>(
    `/api/v1/groups/${groupId}/rooms?status=ALL`,
  );
  const rooms = response.data?.rooms ?? [];
  return rooms
    .map((room) => normalizeRoom(room as RoomInfo & { id?: number; room_id?: number }))
    .filter((room): room is RoomInfo => room !== null);
}

export async function fetchRoomSummary(roomId: number) {
  const response = await apiFetch<RoomSummaryApiResponse>(`/api/v1/rooms/${roomId}/summary`);
  return response.data;
}
