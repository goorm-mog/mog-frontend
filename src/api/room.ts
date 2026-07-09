import { apiFetch } from '@/lib/apiFetch';
import type {
  RoomCreateApiResponse,
  RoomCreateBody,
  RoomListApiResponse,
  RoomSummaryApiResponse,
} from '@/types/room';

export async function createRoom(groupId: number, body: RoomCreateBody) {
  const response = await apiFetch<RoomCreateApiResponse>(`/api/v1/groups/${groupId}/rooms`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.data;
}

export async function fetchGroupRooms(groupId: number) {
  const response = await apiFetch<RoomListApiResponse>(`/api/v1/groups/${groupId}/rooms`);
  return response.data.rooms;
}

export async function fetchRoomSummary(roomId: number) {
  const response = await apiFetch<RoomSummaryApiResponse>(`/api/v1/rooms/${roomId}/summary`);
  return response.data;
}
