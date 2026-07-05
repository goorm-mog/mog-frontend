import { apiFetch } from '@/lib/apiFetch';
import type { RoomDetailResponse } from '@/types/rooms';

export function fetchRoom(roomId: number) {
  return apiFetch<RoomDetailResponse>(`/rooms/${roomId}`);
}
