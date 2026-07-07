import { apiFetch, apiFetchNullOn404 } from '@/lib/apiFetch';
import type { ApiResponse, SettlementResponse } from '@/features/settlement/types/settlement';
import { toMeetDetailData } from '@/features/meetDetail/mapper';
import type {
  ConfirmedScheduleResponse,
  MeetDetailData,
  MeetingRecordListApiResponse,
  RoomStatusApiResponse,
} from '@/features/meetDetail/types';

export async function fetchRoomStatus(roomId: number) {
  const response = await apiFetch<RoomStatusApiResponse>(`/api/v1/groups/rooms/${roomId}`);
  return response.data;
}

export async function fetchMeetingRecords(roomId: number) {
  const response = await apiFetch<MeetingRecordListApiResponse>(
    `/api/v1/rooms/${roomId}/records`,
  );
  return response.data;
}

export async function fetchMeetDetailSettlement(roomId: number) {
  const response = await apiFetchNullOn404<ApiResponse<SettlementResponse>>(
    `/api/v1/rooms/${roomId}/settlement`,
  );
  return response?.data ?? null;
}

export function fetchMeetDetailConfirmedSchedule(roomId: number) {
  return apiFetchNullOn404<ConfirmedScheduleResponse>(`/api/rooms/${roomId}/schedule/confirm`);
}

export async function fetchMeetDetail(roomId: number): Promise<MeetDetailData> {
  const [room, recordsResponse, settlement, confirmedSchedule] = await Promise.all([
    fetchRoomStatus(roomId),
    fetchMeetingRecords(roomId),
    fetchMeetDetailSettlement(roomId),
    fetchMeetDetailConfirmedSchedule(roomId).catch(() => null),
  ]);

  return toMeetDetailData(room, recordsResponse.records, settlement, confirmedSchedule);
}
