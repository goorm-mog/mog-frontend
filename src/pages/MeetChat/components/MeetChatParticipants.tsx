import MemberAvatar from '@/components/common/MemberAvatar/MemberAvatar';
import { cn } from '@/lib/utils';
import type { MeetChatParticipant, MeetChatParticipantStatus } from '@/types/chat';

type MeetChatParticipantsProps = {
  participants: MeetChatParticipant[];
};

const statusText: Record<MeetChatParticipantStatus, string> = {
  host: '방장',
  joined: '참여',
  pending: '대기',
};

function MeetChatParticipants({ participants }: MeetChatParticipantsProps) {
  return (
    <section className="shrink-0 px-[14px] py-4">
      <div className="flex gap-4 overflow-x-auto promise-scrollbar-hidden">
        {participants.map((participant) => {
          const isPending = participant.status === 'pending';
          const isHost = participant.status === 'host';

          return (
            <div key={participant.userId} className="flex shrink-0 flex-col items-center gap-1">
              <MemberAvatar
                name={participant.nickname}
                size="sm"
                selected={!isPending}
                showCheck={false}
                tone={isHost ? 'point' : 'default'}
                unselectedTone="muted"
                labelTone={isPending ? 'muted' : isHost ? 'point' : 'default'}
                className="pointer-events-none"
                tabIndex={-1}
              />
              <span
                className={cn(
                  'font-dm-mono text-[10px] leading-[12px]',
                  isHost ? 'text-point' : 'text-dark-border',
                )}
              >
                {statusText[participant.status]}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MeetChatParticipants;
