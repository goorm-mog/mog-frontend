import { apiFetch } from '@/lib/apiFetch';
import type { ListChatMessagesApiResponse, ListChatMessageResponse } from '@/types/chat';

export async function fetchMeetChatMessages(roomId: number) {
  const response = await apiFetch<ListChatMessagesApiResponse>(`/api/v1/rooms/${roomId}/chat`);
  return response.data;
}

export function sendMeetChatMessage(roomId: number, message: string) {
  return apiFetch<ListChatMessageResponse>(`/api/v1/rooms/${roomId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
