import { ApiError, apiFetch } from '@/lib/apiFetch';
import type { ApiResponse } from '@/features/settlement/types/settlement';
import {
  fetchMeetDetailConfirmedSchedule,
  fetchMeetDetailSettlement,
  fetchMeetingRecords,
  fetchRoomStatus,
} from '@/features/meetDetail/api/meetDetail';
import {
  buildMogCardSummary,
  canRenderMogCard,
} from '@/pages/MogCard/utils/mogCardSummary';
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

export async function fetchMogCardForReceipt(roomId: number) {
  try {
    const summary = await fetchMogCard(roomId);

    if (canRenderMogCard(summary)) {
      return summary;
    }

    return await fetchMogCardFallback(roomId, summary);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 409)) {
      return fetchMogCardFallback(roomId);
    }

    throw error;
  }
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

async function fetchMogCardFallback(
  roomId: number,
  previousSummary?: SummaryCardResponse,
): Promise<SummaryCardResponse> {
  const [room, recordsResponse, settlement, confirmedSchedule] = await Promise.all([
    fetchRoomStatus(roomId),
    fetchMeetingRecords(roomId),
    fetchMeetDetailSettlement(roomId).catch(() => null),
    fetchMeetDetailConfirmedSchedule(roomId).catch(() => null),
  ]);

  return buildMogCardSummary({
    roomId,
    room,
    recordsResponse,
    settlement,
    confirmedSchedule,
    previousSummary,
  });
}
