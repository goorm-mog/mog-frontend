import { apiFetch } from '@/lib/apiFetch';
import type {
  CreateMeetingRecordRequest,
  DeleteRoomPhotoResponse,
  MeetingRecordResponse,
  MeetingRecordsResponse,
  UpdateMeetingRecordRequest,
  UploadRoomPhotoResponse,
} from '@/types/records';

export function uploadRoomPhoto(roomId: number, image: File) {
  const body = new FormData();
  body.append('image', image);

  return apiFetch<UploadRoomPhotoResponse>(`/rooms/${roomId}/photos`, {
    method: 'POST',
    body,
    headers: {},
  });
}

export function deleteRoomPhoto(roomId: number, photoId: number) {
  return apiFetch<DeleteRoomPhotoResponse>(`/rooms/${roomId}/photos/${photoId}`, {
    method: 'DELETE',
  });
}

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
  return apiFetch<DeleteRoomPhotoResponse>(`/rooms/${roomId}/records/${recordId}`, {
    method: 'DELETE',
  });
}
