import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteAllNotifications,
  fetchNotifications,
  markNotificationAsRead,
} from '@/api/notification';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiFetch';
import { getAccessToken } from '@/lib/auth-storage';
import type { NotificationResponse } from '@/types/notification';

function countUnread(items: NotificationResponse[]) {
  return items.filter((item) => !item.isRead).length;
}

export function useNotifications() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const knownNotificationIdsRef = useRef<Set<number>>(new Set());
  const isInitialLoadRef = useRef(true);

  const applyList = useCallback((items: NotificationResponse[]) => {
    setNotifications(items);
    setUnreadCount(countUnread(items));
  }, []);

  const loadNotifications = useCallback(() => {
    return fetchNotifications()
      .then((data) => {
        applyList(data.notifications);

        if (isInitialLoadRef.current) {
          data.notifications.forEach((item) => knownNotificationIdsRef.current.add(item.notificationId));
          isInitialLoadRef.current = false;
        }

        return data.notifications;
      })
      .catch(() => {
        applyList([]);
        return [] as NotificationResponse[];
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [applyList]);

  useEffect(() => {
    let ignore = false;

    fetchNotifications()
      .then((data) => {
        if (ignore) return;

        applyList(data.notifications);

        if (isInitialLoadRef.current) {
          data.notifications.forEach((item) => knownNotificationIdsRef.current.add(item.notificationId));
          isInitialLoadRef.current = false;
        }
      })
      .catch(() => {
        if (!ignore) applyList([]);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [applyList]);

  useEffect(() => {
    if (import.meta.env.VITE_MSW_ENABLED === 'true') return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
    const source = new EventSource(
      `${apiBase}/api/v1/notifications/subscribe?token=${encodeURIComponent(accessToken)}`,
    );

    source.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data) as NotificationResponse;

        if (knownNotificationIdsRef.current.has(notification.notificationId)) return;
        knownNotificationIdsRef.current.add(notification.notificationId);

        setNotifications((prev) => {
          const next = [notification, ...prev];
          setUnreadCount(countUnread(next));
          return next;
        });
        showToast(notification.message, 'info');
      } catch {
        void loadNotifications();
      }
    });

    return () => {
      source.close();
    };
  }, [loadNotifications, showToast]);

  const markAllAsRead = useCallback(
    async (items: NotificationResponse[]) => {
      const unreadItems = items.filter((item) => !item.isRead);
      if (unreadItems.length === 0) {
        setUnreadCount(0);
        return;
      }

      applyList(items.map((item) => ({ ...item, isRead: true })));

      try {
        await Promise.all(unreadItems.map((item) => markNotificationAsRead(item.notificationId)));
      } catch {
        void loadNotifications();
      }
    },
    [applyList, loadNotifications],
  );

  const clearAllNotifications = useCallback(async () => {
    if (notifications.length === 0 || isDeletingAll) return;

    setIsDeletingAll(true);
    const previous = notifications;

    applyList([]);
    knownNotificationIdsRef.current.clear();

    try {
      await deleteAllNotifications();
      showToast('알림을 모두 삭제했어요');
    } catch (error: unknown) {
      applyList(previous);
      const message = error instanceof ApiError ? error.message : '알림을 삭제하지 못했어요';
      showToast(message);
    } finally {
      setIsDeletingAll(false);
    }
  }, [notifications, isDeletingAll, applyList, showToast]);

  const openNotifications = useCallback(async () => {
    setIsLoading(true);
    const latest = await loadNotifications();
    await markAllAsRead(latest);
  }, [loadNotifications, markAllAsRead]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isDeletingAll,
    hasUnreadNotifications: unreadCount > 0,
    openNotifications,
    clearAllNotifications,
    reloadNotifications: loadNotifications,
  };
}
