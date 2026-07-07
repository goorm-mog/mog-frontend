import { apiFetch } from '@/lib/apiFetch';
import type {
  CreateMeetingRecordRequest,
  DeleteMeetingRecordResponse,
  MeetingRecordResponse,
  MeetingRecordsResponse,
  OcrResponse,
  UpdateMeetingRecordRequest,
} from '@/types/records';

export function fetchMeetingRecords(roomId: number) {
  return apiFetch<MeetingRecordsResponse>(`/api/v1/rooms/${roomId}/records`);
}

export function createMeetingRecord(roomId: number, body: CreateMeetingRecordRequest) {
  return apiFetch<MeetingRecordResponse>(`/api/v1/rooms/${roomId}/records`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateMeetingRecord(
  roomId: number,
  recordId: number,
  body: UpdateMeetingRecordRequest,
) {
  return apiFetch<MeetingRecordResponse>(`/api/v1/rooms/${roomId}/records/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteMeetingRecord(roomId: number, recordId: number) {
  return apiFetch<DeleteMeetingRecordResponse>(`/api/v1/rooms/${roomId}/records/${recordId}`, {
    method: 'DELETE',
  });
}

export function analyzeReceiptOcr(roomId: number, image: File) {
  const body = new FormData();
  body.append('image', image);

  return apiFetch<OcrResponse>(`/api/v1/rooms/${roomId}/records/ocr`, {
    method: 'POST',
    body,
  });
}
