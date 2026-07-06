export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface ListChatMessageResponse {
  roomId: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
}

export type ListChatMessagesApiResponse = ApiResponse<ListChatMessageResponse[]>;

export type MeetChatParticipantStatus = 'host' | 'joined' | 'pending';

export interface MeetChatParticipant {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  status: MeetChatParticipantStatus;
}

export interface MeetChatRoom {
  roomId: number;
  groupId: number;
  groupName: string;
  roomName: string;
  promiseDate: string;
  location: string;
}
