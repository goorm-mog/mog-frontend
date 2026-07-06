import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  ListChatMessageResponse,
  ListChatMessagesApiResponse,
} from '@/types/chat';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const mutableMessages: ListChatMessageResponse[] = mockDb.chatMessages.map(
  ({ roomId, senderId, senderName, message, timestamp }) => ({
    roomId,
    senderId,
    senderName,
    message,
    timestamp,
  }),
);

export const chatHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/rooms/:roomId/chat`, ({ params }) => {
    const roomId = Number(params.roomId);
    const room = mockDb.rooms.find((item) => item.roomId === roomId);

    if (!room) {
      return HttpResponse.json(
        { status: 404, code: 'ROOM_NOT_FOUND', message: '방 정보가 없습니다.', data: [] },
        { status: 404 },
      );
    }

    const response: ListChatMessagesApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '채팅 메시지 조회 성공',
      data: mutableMessages.filter((message) => message.roomId === roomId),
    };

    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/api/v1/rooms/:roomId/chat`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = mockDb.rooms.find((item) => item.roomId === roomId);

    if (!room) {
      return HttpResponse.json({ message: '방 정보가 없습니다.' }, { status: 404 });
    }

    const { message } = (await request.json()) as { message?: string };
    const trimmedMessage = message?.trim();

    if (!trimmedMessage) {
      return HttpResponse.json({ message: '메시지를 입력해주세요.' }, { status: 400 });
    }

    const chatMessage: ListChatMessageResponse = {
      roomId,
      senderId: mockDb.auth.currentUser.userId,
      senderName: mockDb.auth.currentUser.nickname,
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
    };
    mutableMessages.push(chatMessage);

    return HttpResponse.json(chatMessage, { status: 201 });
  }),
];
