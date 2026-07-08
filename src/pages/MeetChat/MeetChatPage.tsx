import { MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMeetChatMessages, MeetChatSocket, sendMeetChatMessageMock } from '@/api/chat';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import { getMyUserId } from '@/lib/auth-storage';
import MeetChatComposer from '@/pages/MeetChat/components/MeetChatComposer';
import MeetChatMessages from '@/pages/MeetChat/components/MeetChatMessages';
import MeetChatParticipants from '@/pages/MeetChat/components/MeetChatParticipants';
import MeetChatSummary from '@/pages/MeetChat/components/MeetChatSummary';
import { getMeetChatContext } from '@/pages/MeetChat/constants/meetChatContext';
import type { ListChatMessageResponse, MeetChatParticipant } from '@/types/chat';

function MeetChatPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const isValidRoomId = Number.isFinite(numericRoomId);
  const { room, participants } = useMemo(
    () => getMeetChatContext(isValidRoomId ? numericRoomId : 45),
    [isValidRoomId, numericRoomId],
  );
  const currentUserId = getMyUserId() ?? 1;
  const [messages, setMessages] = useState<ListChatMessageResponse[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(isValidRoomId);
  const [isSending, setIsSending] = useState(false);
  const [isChatConnected, setIsChatConnected] = useState(import.meta.env.VITE_MSW_ENABLED === 'true');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const chatSocketRef = useRef<MeetChatSocket | null>(null);
  const routeErrorMessage = isValidRoomId ? null : '방 정보를 확인할 수 없습니다.';

  useEffect(() => {
    if (!isValidRoomId) return;

    let ignore = false;

    fetchMeetChatMessages(numericRoomId)
      .then((data) => {
        if (!ignore) {
          setErrorMessage(null);
          setMessages(data);
        }
      })
      .catch(() => {
        if (!ignore) setErrorMessage('채팅 정보를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isValidRoomId, numericRoomId]);

  const participantsById = useMemo(
    () =>
      participants.reduce<Record<number, MeetChatParticipant>>((acc, participant) => {
        acc[participant.userId] = participant;
        return acc;
      }, {}),
    [participants],
  );

  const joinedCount = participants.filter((participant) => participant.status !== 'pending').length;

  const appendMessage = useCallback((message: ListChatMessageResponse) => {
    setMessages((current) => {
      const alreadyExists = current.some(
        (item) =>
          item.roomId === message.roomId &&
          item.senderId === message.senderId &&
          item.timestamp === message.timestamp &&
          item.message === message.message,
      );

      return alreadyExists ? current : [...current, message];
    });
  }, []);

  useEffect(() => {
    if (!isValidRoomId || import.meta.env.VITE_MSW_ENABLED === 'true') return;

    const chatSocket = new MeetChatSocket(numericRoomId, {
      onConnect: () => {
        setErrorMessage(null);
        setIsChatConnected(true);
      },
      onMessage: (message) => {
        setErrorMessage(null);
        setIsChatConnected(true);
        appendMessage(message);
      },
      onError: () => {
        setIsChatConnected(false);
        setErrorMessage('실시간 채팅 연결을 확인해주세요.');
      },
      onDisconnect: () => {
        setIsChatConnected(false);
      },
    });

    chatSocketRef.current = chatSocket;
    chatSocket.connect();

    return () => {
      chatSocket.disconnect();
      chatSocketRef.current = null;
    };
  }, [appendMessage, isValidRoomId, numericRoomId]);

  const handleSubmit = useCallback(async () => {
    const content = draft.trim();
    if (!content || !isValidRoomId) return;

    setIsSending(true);
    try {
      if (import.meta.env.VITE_MSW_ENABLED === 'true') {
        const message = await sendMeetChatMessageMock(numericRoomId, content);
        appendMessage(message);
      } else {
        chatSocketRef.current?.send(content);
      }

      setDraft('');
    } catch {
      setErrorMessage('메시지를 보내지 못했습니다.');
    } finally {
      setIsSending(false);
    }
  }, [appendMessage, draft, isValidRoomId, numericRoomId]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopAppBar
        title="채팅"
        showBack
        className="shrink-0 border-b border-dashed border-border/30"
        onBack={() => navigate(-1)}
        rightSlot={
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full text-text"
            aria-label="약속 채팅 메뉴"
          >
            <MoreHorizontal size={20} strokeWidth={2} />
          </button>
        }
      />

      {isLoading && isValidRoomId ? (
        <div className="grid flex-1 place-items-center px-6 text-center text-[14px] leading-[20px] text-dark-border">
          채팅을 불러오는 중입니다.
        </div>
      ) : isValidRoomId ? (
        <>
          <MeetChatSummary
            room={room}
            joinedCount={joinedCount}
            totalCount={participants.length}
          />
          <MeetChatParticipants participants={participants} />
          <MeetChatMessages
            messages={messages}
            participantsById={participantsById}
            currentUserId={currentUserId}
          />
          {errorMessage ? (
            <p className="shrink-0 px-[14px] pt-2 text-[12px] leading-[15px] text-alert">
              {errorMessage}
            </p>
          ) : null}
          <MeetChatComposer
            value={draft}
            placeholder={`${room.roomName} 방에 메시지 보내기`}
            disabled={isSending || !isChatConnected}
            onChange={setDraft}
            onSubmit={handleSubmit}
          />
        </>
      ) : (
        <div className="grid flex-1 place-items-center px-6 text-center text-[14px] leading-[20px] text-alert">
          {routeErrorMessage ?? errorMessage ?? '채팅 정보를 불러오지 못했습니다.'}
        </div>
      )}
    </div>
  );
}

export default MeetChatPage;
