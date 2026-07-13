import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMeetChatMessages, MeetChatSocket, sendMeetChatMessageMock } from '@/api/chat';
import { ApiError } from '@/lib/apiFetch';
import type { ListChatMessageResponse } from '@/types/chat';

const isMockEnabled = import.meta.env.VITE_MSW_ENABLED === 'true';

export function useMeetChat(roomId: number | null) {
  const [messages, setMessages] = useState<ListChatMessageResponse[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(roomId !== null);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(isMockEnabled);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const socketRef = useRef<MeetChatSocket | null>(null);

  const appendMessage = useCallback((message: ListChatMessageResponse) => {
    setMessages((current) => {
      const exists = current.some(
        (item) =>
          item.roomId === message.roomId &&
          item.senderId === message.senderId &&
          item.timestamp === message.timestamp &&
          item.message === message.message,
      );
      return exists ? current : [...current, message];
    });
  }, []);

  useEffect(() => {
    if (roomId === null) return;
    let ignore = false;
    fetchMeetChatMessages(roomId)
      .then((data) => {
        if (ignore) return;
        setErrorMessage(null);
        setMessages(data);
      })
      .catch((error: unknown) => {
        if (ignore) return;

        if (error instanceof ApiError && error.status === 404) {
          setMessages([]);
          setErrorMessage(null);
          return;
        }

        setErrorMessage('이전 채팅 내역을 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [roomId]);

  useEffect(() => {
    if (roomId === null || isMockEnabled) return;
    const socket = new MeetChatSocket(roomId, {
      onConnect: () => {
        setErrorMessage(null);
        setIsConnected(true);
      },
      onMessage: (message) => {
        setErrorMessage(null);
        setIsConnected(true);
        appendMessage(message);
      },
      onError: () => {
        setIsConnected(false);
        setErrorMessage('실시간 채팅 연결을 확인해주세요.');
      },
      onDisconnect: () => setIsConnected(false),
    });
    socketRef.current = socket;
    socket.connect();
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [appendMessage, roomId]);

  const submit = useCallback(async () => {
    const content = draft.trim();
    if (!content || roomId === null) return;
    setIsSending(true);
    try {
      if (isMockEnabled) {
        appendMessage(await sendMeetChatMessageMock(roomId, content));
      } else {
        if (!socketRef.current) throw new Error('채팅 서버에 연결되지 않았습니다.');
        socketRef.current.send(content);
      }
      setDraft('');
    } catch {
      setErrorMessage('메시지를 보내지 못했습니다.');
    } finally {
      setIsSending(false);
    }
  }, [appendMessage, draft, roomId]);

  return {
    messages,
    draft,
    setDraft,
    isLoading,
    isSending,
    isConnected,
    errorMessage,
    submit,
  };
}
