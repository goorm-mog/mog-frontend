import { MoreHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchMeetChatContext } from '@/api/chat';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import { getMyUserId } from '@/lib/auth-storage';
import MeetChatComposer from '@/pages/MeetChat/components/MeetChatComposer';
import MeetChatMessages from '@/pages/MeetChat/components/MeetChatMessages';
import MeetChatParticipants from '@/pages/MeetChat/components/MeetChatParticipants';
import MeetChatSummary from '@/pages/MeetChat/components/MeetChatSummary';
import { useMeetChat } from '@/pages/MeetChat/hooks/useMeetChat';
import type { MeetChatContext, MeetChatParticipant } from '@/types/chat';

interface ContextResult {
  roomId: number;
  context: MeetChatContext | null;
  error: string | null;
}

function MeetChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const isValidRoomId = Number.isInteger(numericRoomId) && numericRoomId > 0;
  const [contextResult, setContextResult] = useState<ContextResult | null>(null);
  const currentContextResult =
    isValidRoomId && contextResult?.roomId === numericRoomId ? contextResult : null;
  const context = currentContextResult?.context ?? null;
  const contextError = currentContextResult?.error ?? null;
  const isContextLoading = isValidRoomId && currentContextResult === null;
  const room = context?.room;
  const participants = useMemo(() => context?.participants ?? [], [context]);
  const currentUserId = getMyUserId() ?? 1;
  const { messages, draft, setDraft, isSending, isConnected, errorMessage, submit } =
    useMeetChat(isValidRoomId ? numericRoomId : null);

  useEffect(() => {
    if (!isValidRoomId) return;

    let ignore = false;

    fetchMeetChatContext(numericRoomId)
      .then((nextContext) => {
        if (!ignore) {
          setContextResult({ roomId: numericRoomId, context: nextContext, error: null });
        }
      })
      .catch(() => {
        if (!ignore) {
          setContextResult({
            roomId: numericRoomId,
            context: null,
            error: '약속 정보를 불러오지 못했습니다.',
          });
        }
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopAppBar
        title="채팅"
        showBack
        className="shrink-0 border-b border-dashed border-border/30"
        onBack={() => {
          const returnTo = (location.state as { returnTo?: unknown } | null)?.returnTo;
          if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
            navigate(returnTo);
            return;
          }
          navigate(-1);
        }}
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

      {isContextLoading ? (
        <div className="grid flex-1 place-items-center px-6 text-center text-[14px] leading-[20px] text-dark-border">
          약속 정보를 불러오는 중입니다.
        </div>
      ) : isValidRoomId && room ? (
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
            placeholder={`${room.roomName || '약속'} 방에 메시지 보내기`}
            disabled={isSending || !isConnected}
            onChange={setDraft}
            onSubmit={submit}
          />
        </>
      ) : (
        <div className="grid flex-1 place-items-center px-6 text-center text-[14px] leading-[20px] text-alert">
          {isValidRoomId ? contextError : '방 정보를 확인할 수 없습니다.'}
        </div>
      )}
    </div>
  );
}

export default MeetChatPage;
