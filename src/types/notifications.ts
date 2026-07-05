import type { ApiResponse } from './groups';

export type NotificationType =
  | 'GROUP_INVITED'
  | 'SETTLEMENT_DONE'
  | 'DATE_CONFIRMED'
  | 'ROOM_CREATED'
  | (string & {});

export type Notification = {
  notificationId: number;
  type: NotificationType;
  message: string;
  roomId: number;
  isRead: boolean;
  createdAt: string;
};

export type NotificationsData = {
  unreadCount: number;
  notifications: Notification[];
};

export type NotificationsResponse = ApiResponse<NotificationsData>;

export type NotificationMutationResponse = ApiResponse<string>;
