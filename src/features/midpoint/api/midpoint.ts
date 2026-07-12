import { apiFetch, apiFetchNullOn404 } from '@/lib/apiFetch';
import type {
  ConfirmPlaceRequest,
  ConfirmedPlaceResponse,
  MidpointResult,
} from '@/features/midpoint/types/midpoint';

export function fetchMidpoint(roomId: number) {
  return apiFetchNullOn404<MidpointResult>(`/api/rooms/${roomId}/midpoint`);
}

export function calculateMidpoint(roomId: number) {
  return apiFetch<MidpointResult>(`/api/rooms/${roomId}/midpoint/calculate`, { method: 'POST' });
}

export function confirmMidpointPlace(roomId: number, body: ConfirmPlaceRequest) {
  return apiFetch<ConfirmedPlaceResponse>(`/api/rooms/${roomId}/midpoint/confirm`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
