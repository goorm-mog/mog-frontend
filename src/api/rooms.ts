import { apiFetch } from '@/lib/apiFetch';
import type {
  CreateRoomRequest,
  RoomDetailResponse,
  RoomCloseResponse,
  RoomCreateResponse,
  RoomListResponse,
  RoomStatus,
  RoomStatusResponse,
  RoomStepResponse,
} from '@/types/rooms';

export function fetchRoom(roomId: number) {
  return apiFetch<RoomDetailResponse>(`/rooms/${roomId}`);
}

export function createRoom(groupId: number, request: CreateRoomRequest) {
  return apiFetch<RoomCreateResponse>(`/api/v1/groups/${groupId}/rooms`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateRoomStep(roomId: number, nextStatus: RoomStatus) {
  return apiFetch<RoomStepResponse>(`/api/v1/groups/rooms/${roomId}/step`, {
    method: 'PATCH',
    body: JSON.stringify({ nextStatus }),
  });
}

export function fetchGroupRooms(groupId: number) {
  return apiFetch<RoomListResponse>(`/api/v1/groups/${groupId}/rooms`);
}

export function fetchGroupRoom(roomId: number) {
  return apiFetch<RoomStatusResponse>(`/api/v1/groups/rooms/${roomId}`);
}

export function deleteRoom(roomId: number) {
  return apiFetch<RoomCloseResponse>(`/api/v1/groups/rooms/${roomId}`, {
    method: 'DELETE',
  });
}
