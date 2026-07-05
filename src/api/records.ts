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
  return apiFetch<MeetingRecordsResponse>(`/rooms/${roomId}/records`);
}

export function createMeetingRecord(roomId: number, body: CreateMeetingRecordRequest) {
  return apiFetch<MeetingRecordResponse>(`/rooms/${roomId}/records`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function updateMeetingRecord(
  roomId: number,
  recordId: number,
  body: UpdateMeetingRecordRequest,
) {
  return apiFetch<MeetingRecordResponse>(`/rooms/${roomId}/records/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function deleteMeetingRecord(roomId: number, recordId: number) {
  return apiFetch<DeleteMeetingRecordResponse>(`/rooms/${roomId}/records/${recordId}`, {
    method: 'DELETE',
  });
}

export function analyzeReceiptOcr(roomId: number, image: File) {
  const body = new FormData();
  body.append('image', image);

  return apiFetch<OcrResponse>(`/rooms/${roomId}/records/ocr`, {
    method: 'POST',
    body,
    headers: {},
  });
}
