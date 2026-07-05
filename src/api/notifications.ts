import { apiFetch } from '@/lib/apiFetch';
import type {
  Notification,
  NotificationMutationResponse,
  NotificationsResponse,
} from '@/types/notifications';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const NOTIFICATIONS_PATH = '/api/v1/notifications';

type SubscribeNotificationsOptions = {
  onMessage: (data: Notification) => void;
  onError?: (event: Event) => void;
};

export function fetchNotifications(unreadOnly = false) {
  const params = unreadOnly ? '?unreadOnly=true' : '';
  return apiFetch<NotificationsResponse>(`${NOTIFICATIONS_PATH}${params}`);
}

export function readNotification(notificationId: number) {
  return apiFetch<NotificationMutationResponse>(`${NOTIFICATIONS_PATH}/${notificationId}/read`, {
    method: 'PATCH',
  });
}

export function deleteNotifications() {
  return apiFetch<NotificationMutationResponse>(NOTIFICATIONS_PATH, {
    method: 'DELETE',
  });
}

export function subscribeNotifications({
  onMessage,
  onError,
}: SubscribeNotificationsOptions): EventSource {
  const eventSource = new EventSource(`${API_BASE}${NOTIFICATIONS_PATH}/subscribe`);

  eventSource.onmessage = (event) => {
    onMessage(JSON.parse(event.data) as Notification);
  };

  eventSource.onerror = (event) => {
    onError?.(event);
    eventSource.close();
  };

  return eventSource;
}
