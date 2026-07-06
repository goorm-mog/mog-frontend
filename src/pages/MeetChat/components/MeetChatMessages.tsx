import { cn } from '@/lib/utils';
import type { ListChatMessageResponse, MeetChatParticipant } from '@/types/chat';
import { formatChatDate, formatChatTime } from '@/pages/MeetChat/utils/format';

type MeetChatMessagesProps = {
  messages: ListChatMessageResponse[];
  participantsById: Record<number, MeetChatParticipant>;
  currentUserId: number;
};

function MeetChatMessages({ messages, participantsById, currentUserId }: MeetChatMessagesProps) {
  const firstMessage = messages[0];

  return (
    <main className="min-h-0 flex-1 overflow-y-auto border-y border-dashed border-border/30 px-[14px] py-4">
      <div className="flex flex-col gap-4">
        {firstMessage ? (
          <div className="flex justify-center">
            <span className="rounded-full border border-border/30 bg-dark-background/35 px-3 py-1 font-dm-mono text-[11px] leading-[14px] text-dark-border">
              {formatChatDate(firstMessage.timestamp)}
            </span>
          </div>
        ) : null}

        {messages.map((message) => {
          const sender = message.senderId ? participantsById[message.senderId] : undefined;
          const isMine = message.senderId === currentUserId;
          const messageKey = `${message.roomId}-${message.senderId}-${message.timestamp}`;

          return (
            <div
              key={messageKey}
              className={cn('flex items-end gap-2', isMine ? 'justify-end' : 'justify-start')}
            >
              {!isMine ? (
                <div className="mb-4 grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-border text-dark-border">
                  <span className="text-[11px] leading-none font-semibold">
                    {(sender?.nickname ?? message.senderName).slice(0, 1)}
                  </span>
                </div>
              ) : null}

              <div className={cn('flex max-w-[274px] flex-col gap-1', isMine && 'items-end')}>
                {!isMine ? (
                  <span className="px-1 text-[12px] leading-[15px] font-medium text-dark-border">
                    {sender?.nickname ?? message.senderName}
                  </span>
                ) : null}
                <div className="flex items-end gap-1.5">
                  {isMine ? (
                    <span className="font-dm-mono text-[10px] leading-[13px] text-border">
                      {formatChatTime(message.timestamp)}
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
                    {message.message}
                  </p>
                  {!isMine ? (
                    <span className="font-dm-mono text-[10px] leading-[13px] text-border">
                      {formatChatTime(message.timestamp)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default MeetChatMessages;
