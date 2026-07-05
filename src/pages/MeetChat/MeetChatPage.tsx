import { CalendarDays, MapPin, MoreHorizontal, Paperclip, Send, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MemberAvatar from '@/components/common/MemberAvatar/MemberAvatar';
import RoughBorder from '@/components/common/RoughBorder';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import { cn } from '@/lib/utils';

type ChatParticipant = {
  id: string;
  name: string;
  status: 'host' | 'joined' | 'pending';
};

type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  kind?: 'message' | 'notice';
};

const MEET = {
  groupName: '필름 산책단',
  title: '을지로 필름 산책',
  dateTime: '7월 12일 일요일 14:00',
  location: '을지로입구역 3번 출구',
};

const PARTICIPANTS: ChatParticipant[] = [
  { id: 'user-me', name: '나', status: 'joined' },
  { id: 'user-min', name: '민지', status: 'host' },
  { id: 'user-jun', name: '준호', status: 'joined' },
  { id: 'user-seo', name: '서연', status: 'pending' },
];

const MESSAGES: ChatMessage[] = [
  {
    id: 'notice-created',
    senderId: 'system',
    text: '민지가 약속 방을 만들었어요',
    sentAt: '13:08',
    kind: 'notice',
  },
  {
    id: 'message-1',
    senderId: 'user-min',
    text: '이번 주 일요일에 을지로에서 만나서 필름 한 롤 찍고 근처 카페 갈까요?',
    sentAt: '13:10',
  },
  {
    id: 'message-2',
    senderId: 'user-jun',
    text: '좋아요. 저는 2시부터 가능해요.',
    sentAt: '13:12',
  },
  {
    id: 'message-3',
    senderId: 'user-me',
    text: '그럼 2시에 3번 출구 앞에서 만나는 걸로 할게요.',
    sentAt: '13:15',
  },
  {
    id: 'notice-location',
    senderId: 'system',
    text: '약속 장소가 을지로입구역 3번 출구로 정해졌어요',
    sentAt: '13:16',
    kind: 'notice',
  },
  {
    id: 'message-4',
    senderId: 'user-min',
    text: '비 오면 바로 옆 실내 카페로 이동해요. 제가 후보 장소 적어둘게요.',
    sentAt: '13:18',
  },
];

const statusText: Record<ChatParticipant['status'], string> = {
  host: '방장',
  joined: '참여',
  pending: '대기',
};

function MeetChatPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [draft, setDraft] = useState('');

  const participantsById = useMemo(
    () =>
      PARTICIPANTS.reduce<Record<string, ChatParticipant>>((acc, participant) => {
        acc[participant.id] = participant;
        return acc;
      }, {}),
    [],
  );

  const joinedCount = PARTICIPANTS.filter((participant) => participant.status !== 'pending').length;

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

      <section className="shrink-0 px-[14px] pt-4">
        <RoughBorder
          fill="color-mix(in srgb, var(--color-dark-background) 46%, transparent)"
          containerClassName="w-full"
          className="px-5 py-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] leading-[15px] font-medium text-dark-border">
                {MEET.groupName}
              </p>
              <h1 className="mt-1 truncate text-[22px] leading-[27px] font-semibold text-text">
                {MEET.title}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-border/40 px-2.5 py-1 text-[12px] leading-[15px] font-semibold text-dark-border">
              <Users size={13} strokeWidth={2} />
              {joinedCount}/{PARTICIPANTS.length}
            </div>
          </div>

          <div className="mt-4 grid gap-2 border-t border-dashed border-border/50 pt-3">
            <div className="flex items-center gap-2 text-[13px] leading-[16px] text-dark-border">
              <CalendarDays size={15} strokeWidth={1.8} />
              <span>{MEET.dateTime}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] leading-[16px] text-dark-border">
              <MapPin size={15} strokeWidth={1.8} />
              <span className="truncate">{MEET.location}</span>
            </div>
          </div>
        </RoughBorder>
      </section>

      <section className="shrink-0 px-[14px] py-4">
        <div className="flex gap-4 overflow-x-auto promise-scrollbar-hidden">
          {PARTICIPANTS.map((participant) => (
            <div key={participant.id} className="flex shrink-0 flex-col items-center gap-1">
              <MemberAvatar
                name={participant.name}
                size="sm"
                selected={participant.status !== 'pending'}
                showCheck={participant.status === 'host'}
                tone={participant.status === 'host' ? 'point' : 'default'}
                unselectedTone="muted"
                labelTone={participant.status === 'pending' ? 'muted' : 'default'}
                disabled
              />
              <span
                className={cn(
                  'font-dm-mono text-[10px] leading-[12px]',
                  participant.status === 'host' ? 'text-point' : 'text-dark-border',
                )}
              >
                {statusText[participant.status]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <main className="min-h-0 flex-1 overflow-y-auto border-y border-dashed border-border/30 px-[14px] py-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <span className="rounded-full border border-border/30 bg-dark-background/35 px-3 py-1 font-dm-mono text-[11px] leading-[14px] text-dark-border">
              2026.07.05
            </span>
          </div>

          {MESSAGES.map((message) => {
            if (message.kind === 'notice') {
              return (
                <div key={message.id} className="flex justify-center">
                  <p className="max-w-[280px] rounded border border-dashed border-border/40 bg-dark-background/25 px-3 py-2 text-center text-[12px] leading-[16px] text-dark-border">
                    {message.text}
                  </p>
                </div>
              );
            }

            const sender = participantsById[message.senderId];
            const isMine = message.senderId === 'user-me';

            return (
              <div
                key={message.id}
                className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}
              >
                {!isMine ? (
                  <div className="mb-4 grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-border text-dark-border">
                    <span className="text-[11px] leading-none font-semibold">
                      {sender?.name.slice(0, 1)}
                    </span>
                  </div>
                ) : null}

                <div className={cn('flex max-w-[274px] flex-col gap-1', isMine && 'items-end')}>
                  {!isMine ? (
                    <span className="px-1 text-[12px] leading-[15px] font-medium text-dark-border">
                      {sender?.name}
                    </span>
                  ) : null}
                  <div className="flex items-end gap-1.5">
                    {isMine ? (
                      <span className="font-dm-mono text-[10px] leading-[13px] text-border">
                        {message.sentAt}
                      </span>
                    ) : null}
                    <p
                      className={cn(
                        'rounded px-3.5 py-2.5 text-[14px] leading-[20px] shadow-[1px_1px_0_rgba(160,149,131,0.35)]',
                        isMine
                          ? 'bg-point text-background'
                          : 'border border-border/35 bg-dark-background/45 text-text',
                      )}
                    >
                      {message.text}
                    </p>
                    {!isMine ? (
                      <span className="font-dm-mono text-[10px] leading-[13px] text-border">
                        {message.sentAt}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <form
        className="shrink-0 bg-background px-[14px] pt-3 pb-4"
        onSubmit={(event) => {
          event.preventDefault();
          setDraft('');
        }}
      >
        <div className="flex min-h-12 items-end gap-2 rounded border border-border/45 bg-dark-background/25 p-2">
          <button
            type="button"
            className="grid size-8 shrink-0 place-items-center rounded-full text-dark-border"
            aria-label="파일 첨부"
          >
            <Paperclip size={18} strokeWidth={1.9} />
          </button>
          <textarea
            className="max-h-24 min-h-8 flex-1 resize-none bg-transparent px-1 py-1 text-[14px] leading-[20px] text-text outline-none placeholder:text-border"
            value={draft}
            rows={1}
            placeholder={`${roomId ?? '약속'} 방에 메시지 보내기`}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            type="submit"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-text text-background disabled:bg-border"
            aria-label="메시지 전송"
            disabled={!draft.trim()}
          >
            <Send size={16} strokeWidth={2.2} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeetChatPage;
