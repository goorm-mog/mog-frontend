import { apiFetch } from '@/lib/apiFetch';
import type {
  DepartureListResponse,
  RegisterDepartureRequest,
  RegisterDepartureResponse,
  UpdateDepartureResponse,
} from '@/features/departure/types/departure';

export function fetchDepartures(roomId: number) {
  return apiFetch<DepartureListResponse>(`/rooms/${roomId}/departure`);
}

export function registerDeparture(roomId: number, body: RegisterDepartureRequest) {
  return apiFetch<RegisterDepartureResponse>(`/rooms/${roomId}/departure`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateDeparture(roomId: number, body: RegisterDepartureRequest) {
  return apiFetch<UpdateDepartureResponse>(`/rooms/${roomId}/departure`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
