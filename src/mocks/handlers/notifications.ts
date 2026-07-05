import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type { Notification, NotificationsData } from '@/types/notifications';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

const ok = <T>(data: T, message = '요청이 성공했습니다.'): ApiResponse<T> => ({
  status: 0,
  code: 'SUCCESS',
  message,
  data,
});

const error = (status: number, code: string, message: string) =>
  HttpResponse.json({ status, code, message, data: null }, { status });

const notifications: Notification[] = mockDb.notifications.map(
  ({ notificationId, type, message, roomId, isRead, createdAt }) => ({
    notificationId,
    type,
    message,
    roomId,
    isRead,
    createdAt,
  }),
);

const sortByNewest = (items: Notification[]) =>
  [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const getNotificationsData = (unreadOnly: boolean): NotificationsData => {
  const currentUserNotifications = notifications.filter((notification) =>
    mockDb.notifications.some(
      (source) =>
        source.userId === mockDb.auth.currentUser.userId &&
        source.notificationId === notification.notificationId,
    ),
  );
  const filteredNotifications = unreadOnly
    ? currentUserNotifications.filter(({ isRead }) => !isRead)
    : currentUserNotifications;

  return {
    unreadCount: currentUserNotifications.filter(({ isRead }) => !isRead).length,
    notifications: sortByNewest(filteredNotifications).slice(0, 50),
  };
};

const createSseStream = () => {
  const latestUnread = getNotificationsData(true).notifications[0];
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(latestUnread ?? { timeout: 0 })}\n\n`),
      );
    },
    cancel() {},
  });
};

export const notificationHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/notifications/subscribe`, () => {
    return new HttpResponse(createSseStream(), {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),

  http.get(`${BASE}/api/v1/notifications`, ({ request }) => {
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';

    return HttpResponse.json(ok(getNotificationsData(unreadOnly), '알림 목록 조회에 성공했습니다.'));
  }),

  http.patch(`${BASE}/api/v1/notifications/:notificationId/read`, ({ params }) => {
    const notificationId = Number(params.notificationId);
    const notification = notifications.find((item) => item.notificationId === notificationId);

    if (!notification) {
      return error(404, 'NOTIFICATION_NOT_FOUND', '알림을 찾을 수 없습니다.');
    }

    notification.isRead = true;

    return HttpResponse.json(ok('success', '알림 읽음 처리에 성공했습니다.'));
  }),

  http.delete(`${BASE}/api/v1/notifications`, () => {
    const currentUserNotificationIds = new Set<number>(
      mockDb.notifications
        .filter(({ userId }) => userId === mockDb.auth.currentUser.userId)
        .map(({ notificationId }) => notificationId),
    );

    for (let index = notifications.length - 1; index >= 0; index -= 1) {
      if (currentUserNotificationIds.has(notifications[index].notificationId)) {
        notifications.splice(index, 1);
      }
    }

    return HttpResponse.json(ok('success', '전체 알림 삭제에 성공했습니다.'));
  }),
];
