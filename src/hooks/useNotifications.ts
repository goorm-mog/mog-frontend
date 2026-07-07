import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchNotifications, markNotificationAsRead } from '@/api/notification';
import { useToast } from '@/hooks/useToast';
import { getAccessToken } from '@/lib/auth-storage';
import type { NotificationResponse } from '@/types/notification';

export function useNotifications() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const knownNotificationIdsRef = useRef<Set<number>>(new Set());
  const isInitialLoadRef = useRef(true);

  const applyList = useCallback((items: NotificationResponse[], nextUnreadCount: number) => {
    setNotifications(items);
    setUnreadCount(nextUnreadCount);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      applyList(data.notifications, data.unreadCount);

      if (isInitialLoadRef.current) {
        data.notifications.forEach((item) => knownNotificationIdsRef.current.add(item.notificationId));
        isInitialLoadRef.current = false;
      }
    } catch {
      applyList([], 0);
    } finally {
      setIsLoading(false);
    }
  }, [applyList]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (import.meta.env.VITE_MSW_ENABLED === 'true') return;

    const accessToken = getAccessToken();
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
    if (!accessToken || !apiBase) return;

    const source = new EventSource(
      `${apiBase}/api/v1/notifications/subscribe?token=${encodeURIComponent(accessToken)}`,
    );

    source.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data) as NotificationResponse;

        if (knownNotificationIdsRef.current.has(notification.notificationId)) return;
        knownNotificationIdsRef.current.add(notification.notificationId);

        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        showToast(notification.message, 'info');
      } catch {
        void loadNotifications();
      }
    });

    return () => {
      source.close();
    };
  }, [loadNotifications, showToast]);

  const markAllAsRead = useCallback(async () => {
    const unreadItems = notifications.filter((item) => !item.isRead);
    if (unreadItems.length === 0) return;

    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await Promise.all(unreadItems.map((item) => markNotificationAsRead(item.notificationId)));
    } catch {
      void loadNotifications();
    }
  }, [notifications, loadNotifications]);

  const openNotifications = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  return {
    notifications,
    unreadCount,
    isLoading,
    hasUnreadNotifications: unreadCount > 0,
    openNotifications,
    reloadNotifications: loadNotifications,
  };
}
