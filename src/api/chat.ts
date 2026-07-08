import { apiFetch } from '@/lib/apiFetch';
import { getAccessToken } from '@/lib/auth-storage';
import type { ListChatMessagesApiResponse, ListChatMessageResponse } from '@/types/chat';

export async function fetchMeetChatMessages(roomId: number) {
  const response = await apiFetch<ListChatMessagesApiResponse>(`/api/v1/rooms/${roomId}/chat`);
  return response.data;
}

export function sendMeetChatMessageMock(roomId: number, message: string) {
  return apiFetch<ListChatMessageResponse>(`/api/v1/rooms/${roomId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

type MeetChatSocketHandlers = {
  onConnect?: () => void;
  onMessage: (message: ListChatMessageResponse) => void;
  onError?: () => void;
  onDisconnect?: () => void;
};

type StompHeaders = Record<string, string>;

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const WS_BASE = import.meta.env.VITE_WS_BASE_URL ?? toWebSocketBaseUrl(API_BASE);

function toWebSocketBaseUrl(apiBase: string) {
  if (!apiBase) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}`;
  }

  if (apiBase.startsWith('https://')) return apiBase.replace(/^https:\/\//, 'wss://');
  if (apiBase.startsWith('http://')) return apiBase.replace(/^http:\/\//, 'ws://');
  return apiBase;
}

function encodeFrame(command: string, headers: StompHeaders = {}, body = '') {
  const headerLines = Object.entries(headers).map(([key, value]) => `${key}:${value}`);
  return `${command}\n${headerLines.join('\n')}\n\n${body}\0`;
}

function decodeFrame(rawFrame: string) {
  const frame = rawFrame.replace(/\0$/, '');
  const [head = '', body = ''] = frame.split('\n\n');
  const [command = '', ...headerLines] = head.split('\n');
  const headers = headerLines.reduce<StompHeaders>((acc, line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex > -1) {
      acc[line.slice(0, separatorIndex)] = line.slice(separatorIndex + 1);
    }
    return acc;
  }, {});

  return { command, headers, body };
}

export class MeetChatSocket {
  private socket: WebSocket | null = null;
  private subscriptionId = '';
  private readonly roomId: number;
  private readonly handlers: MeetChatSocketHandlers;

  constructor(roomId: number, handlers: MeetChatSocketHandlers) {
    this.roomId = roomId;
    this.handlers = handlers;
  }

  connect() {
    const accessToken = getAccessToken();

    if (!accessToken) {
      this.handlers.onError?.();
      return;
    }

    this.subscriptionId = `room-${this.roomId}-${Date.now()}`;
    this.socket = new WebSocket(`${WS_BASE}/ws-stomp`);

    this.socket.onopen = () => {
      this.socket?.send(
        encodeFrame('CONNECT', {
          'accept-version': '1.2',
          'heart-beat': '10000,10000',
          Authorization: `Bearer ${accessToken}`,
        }),
      );
    };

    this.socket.onmessage = (event) => {
      if (typeof event.data !== 'string') return;

      event.data
        .split('\0')
        .filter((rawFrame) => rawFrame.trim())
        .forEach((rawFrame) => this.handleFrame(`${rawFrame}\0`));
    };

    this.socket.onerror = () => {
      this.handlers.onError?.();
    };

    this.socket.onclose = () => {
      this.handlers.onDisconnect?.();
    };
  }

  send(message: string) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error('채팅 서버에 연결되지 않았습니다.');
    }

    this.socket.send(
      encodeFrame(
        'SEND',
        {
          destination: `/pub/api/v1/rooms/${this.roomId}/chat`,
          'content-type': 'application/json',
        },
        JSON.stringify({ message }),
      ),
    );
  }

  disconnect() {
    if (!this.socket) return;

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(encodeFrame('DISCONNECT'));
    }

    this.socket.close();
    this.socket = null;
  }

  private handleFrame(rawFrame: string) {
    const { command, body } = decodeFrame(rawFrame);

    if (command === 'CONNECTED') {
      this.handlers.onConnect?.();
      this.socket?.send(
        encodeFrame('SUBSCRIBE', {
          id: this.subscriptionId,
          destination: `/sub/api/v1/rooms/${this.roomId}`,
        }),
      );
      return;
    }

    if (command === 'MESSAGE') {
      try {
        this.handlers.onMessage(JSON.parse(body) as ListChatMessageResponse);
      } catch {
        this.handlers.onError?.();
      }
      return;
    }

    if (command === 'ERROR') {
      this.handlers.onError?.();
    }
  }
}
