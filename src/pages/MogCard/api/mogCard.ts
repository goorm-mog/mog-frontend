import { apiFetch } from '@/lib/apiFetch';
import type { ApiResponse } from '@/features/settlement/types/settlement';
import type {
  CardImageResponse,
  SummaryCardResponse,
} from '@/pages/MogCard/types';

export async function fetchMogCard(roomId: number) {
  const response = await apiFetch<ApiResponse<SummaryCardResponse>>(
    `/api/v1/rooms/${roomId}/summary`,
  );

  return response.data;
}

export async function saveMogCardImage(roomId: number, image: Blob) {
  const body = new FormData();
  body.append('image', image, `mog-card-${roomId}.png`);

  const response = await apiFetch<ApiResponse<CardImageResponse>>(
    `/api/v1/rooms/${roomId}/summary/card`,
    {
      method: 'POST',
      body,
    },
  );

  return response.data;
}
