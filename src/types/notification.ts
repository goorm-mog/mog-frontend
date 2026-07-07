import type { ApiResponse } from '@/types/chat';

export type NotificationType =
  | 'GROUP_INVITED'
  | 'ROOM_CREATED'
  | 'DATE_CONFIRMED'
  | 'PLACE_CONFIRMED'
  | 'RECORD_ADDED'
  | 'SETTLEMENT_DONE'
  | 'SUMMARY_READY';

export type NotificationResponse = {
  notificationId: number;
  type: NotificationType;
  message: string;
  roomId: number;
  isRead: boolean;
  createdAt: string;
};

export type NotificationListResponse = {
  unreadCount: number;
  notifications: NotificationResponse[];
};

export type NotificationListApiResponse = ApiResponse<NotificationListResponse>;
