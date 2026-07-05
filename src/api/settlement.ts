import { apiFetch, apiFetchNullOn404 } from '@/lib/apiFetch';
import type { SettlementMutationResponse, SettlementResponse } from '@/types/settlement';

export function fetchSettlement(roomId: number) {
  return apiFetchNullOn404<SettlementResponse>(`/rooms/${roomId}/settlement`);
}

export function calculateSettlement(roomId: number) {
  return apiFetch<SettlementMutationResponse>(`/rooms/${roomId}/settlement`, {
    method: 'POST',
  });
}

export function confirmSettlement(roomId: number) {
  return apiFetch<SettlementMutationResponse>(`/rooms/${roomId}/settlement/confirm`, {
    method: 'PATCH',
  });
}
