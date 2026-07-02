import { apiFetch, apiFetchNullOn404 } from '@/lib/apiFetch';
import type { ConfirmScheduleResponse, RegisterSlotsResponse, RoomMembersResponse, SlotsResponse, VoteResponse } from '@/types/schedule';

export function fetchConfirmedSchedule(roomId: number) {
  return apiFetchNullOn404<ConfirmScheduleResponse>(`/rooms/${roomId}/schedule/confirm`);
}

export function fetchSlots(roomId: number) {
  return apiFetch<SlotsResponse>(`/rooms/${roomId}/schedule/slots`);
}

export function fetchSlotsIfExists(roomId: number) {
  return apiFetchNullOn404<SlotsResponse>(`/rooms/${roomId}/schedule/slots`);
}

export function registerSlots(roomId: number, slots: { date: string; time: string }[]) {
  return apiFetch<RegisterSlotsResponse>(`/rooms/${roomId}/schedule/slots`, {
    method: 'POST',
    body: JSON.stringify({ slots }),
  });
}

export function submitVotes(roomId: number, slotIds: number[]) {
  return apiFetch<VoteResponse>(`/rooms/${roomId}/schedule/votes`, {
    method: 'POST',
    body: JSON.stringify({ slotIds }),
  });
}

export function fetchRoomMembers(roomId: number) {
  return apiFetch<RoomMembersResponse>(`/rooms/${roomId}/members`);
}

export function confirmSchedule(roomId: number, date: string, time: string) {
  return apiFetch<ConfirmScheduleResponse>(`/rooms/${roomId}/schedule/confirm`, {
    method: 'POST',
    body: JSON.stringify({ date, time }),
  });
}
