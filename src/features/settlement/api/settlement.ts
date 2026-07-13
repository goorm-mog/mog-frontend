import { apiFetch } from '@/lib/apiFetch';
import type {
  ApiResponse,
  SettlementResponse,
  SplitRequest,
  SplitResponse,
} from '@/features/settlement/types/settlement';

export async function fetchSettlement(roomId: number) {
  const response = await apiFetch<ApiResponse<SettlementResponse>>(
    `/api/v1/rooms/${roomId}/settlement`,
  );
  return response.data;
}

export async function calculateSettlement(roomId: number) {
  const response = await apiFetch<ApiResponse<SettlementResponse>>(
    `/api/v1/rooms/${roomId}/settlement`,
    {
      method: 'POST',
    },
  );
  return response.data;
}

export async function confirmSettlement(roomId: number) {
  const response = await apiFetch<ApiResponse<SettlementResponse>>(
    `/api/v1/rooms/${roomId}/settlement/confirm`,
    {
      method: 'PATCH',
    },
  );
  return response.data;
}

export async function splitSettlementAmount(payload: SplitRequest) {
  const response = await apiFetch<ApiResponse<SplitResponse>>('/api/v1/settlement/split', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}
