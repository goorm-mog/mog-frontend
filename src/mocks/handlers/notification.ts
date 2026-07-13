import { http, HttpResponse, type HttpHandler } from 'msw';
import { notificationsDb } from '@/mocks/db/notification';
import type { NotificationListApiResponse, NotificationResponse } from '@/types/notification';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const mutableNotifications: NotificationResponse[] = notificationsDb.map((item) => ({ ...item }));

function buildListResponse(unreadOnly = false): NotificationListApiResponse {
  const notifications = [...mutableNotifications]
    .filter((item) => !unreadOnly || !item.isRead)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = mutableNotifications.filter((item) => !item.isRead).length;

  return {
    status: 200,
    code: 'SUCCESS',
    message: '알림 목록 조회 성공',
    data: {
      unreadCount,
      notifications,
    },
  };
}

export const notificationHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/notifications`, ({ request }) => {
    const unreadOnly = new URL(request.url).searchParams.get('unreadOnly') === 'true';
    return HttpResponse.json(buildListResponse(unreadOnly));
  }),

  http.patch(`${BASE}/api/v1/notifications/:notificationId/read`, ({ params }) => {
    const notificationId = Number(params.notificationId);
    const target = mutableNotifications.find((item) => item.notificationId === notificationId);

    if (!target) {
      return HttpResponse.json({ message: '알림을 찾을 수 없습니다.' }, { status: 404 });
    }

    target.isRead = true;

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '읽음 처리 성공',
      data: null,
    });
  }),

  http.delete(`${BASE}/api/v1/notifications`, () => {
    mutableNotifications.length = 0;

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '전체 알림 삭제 성공',
      data: null,
    });
  }),
];

export { mutableNotifications };
