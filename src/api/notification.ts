import { apiFetch } from '@/lib/apiFetch';
import type { ApiResponse } from '@/types/chat';
import type { NotificationListApiResponse } from '@/types/notification';

type FetchNotificationsParams = {
  unreadOnly?: boolean;
};

export async function fetchNotifications({ unreadOnly }: FetchNotificationsParams = {}) {
  const searchParams = new URLSearchParams();
  if (unreadOnly !== undefined) {
    searchParams.set('unreadOnly', String(unreadOnly));
  }

  const query = searchParams.toString();
  const path = query ? `/api/v1/notifications?${query}` : '/api/v1/notifications';
  const response = await apiFetch<NotificationListApiResponse>(path);
  return response.data;
}

export function markNotificationAsRead(notificationId: number) {
  return apiFetch<ApiResponse<null>>(`/api/v1/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export function deleteAllNotifications() {
  return apiFetch<ApiResponse<null>>('/api/v1/notifications', {
    method: 'DELETE',
  });
}
