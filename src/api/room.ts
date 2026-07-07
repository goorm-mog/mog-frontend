import { apiFetch } from '@/lib/apiFetch';
import type { RoomCreateApiResponse, RoomCreateBody } from '@/types/room';

export async function createRoom(groupId: number, body: RoomCreateBody) {
  const response = await apiFetch<RoomCreateApiResponse>(`/api/v1/groups/${groupId}/rooms`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.data;
}
