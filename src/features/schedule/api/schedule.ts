import { apiFetch, apiFetchNullOn404 } from '@/lib/apiFetch';
import type { ApiResponse } from '@/types/api';
import type {
  ConfirmScheduleResponse,
  RegisterSlotsResponse,
  RoomMembersResponse,
  RoomStatusResponse,
  SlotsResponse,
  VoteResponse,
} from '@/features/schedule/types/schedule';

export function fetchConfirmedSchedule(roomId: number) {
  return apiFetchNullOn404<ConfirmScheduleResponse>(`/api/rooms/${roomId}/schedule/confirm`);
}

export function fetchSlots(roomId: number) {
  return apiFetch<SlotsResponse>(`/api/rooms/${roomId}/schedule/slots`);
}

export function fetchSlotsIfExists(roomId: number) {
  return apiFetchNullOn404<SlotsResponse>(`/api/rooms/${roomId}/schedule/slots`);
}

export function registerSlots(roomId: number, slots: { date: string; time: string }[]) {
  return apiFetch<RegisterSlotsResponse>(`/api/rooms/${roomId}/schedule/slots`, {
    method: 'POST',
    body: JSON.stringify({ slots }),
  });
}

export function submitVotes(roomId: number, slotIds: number[]) {
  return apiFetch<VoteResponse>(`/api/rooms/${roomId}/schedule/votes`, {
    method: 'POST',
    body: JSON.stringify({ slotIds }),
  });
}

export function fetchRoomMembers(roomId: number): Promise<RoomMembersResponse> {
  return apiFetch<ApiResponse<RoomStatusResponse>>(`/api/v1/groups/rooms/${roomId}`).then((response) => ({
    members: response.data?.members ?? [],
  }));
}

export function confirmSchedule(roomId: number, date: string, time: string) {
  return apiFetch<ConfirmScheduleResponse>(`/api/rooms/${roomId}/schedule/confirm`, {
    method: 'PATCH',
    body: JSON.stringify({ date, time }),
  });
}
