import { CalendarDays, MapPin, Users } from 'lucide-react';
import RoughBorder from '@/components/common/RoughBorder';
import type { MeetChatRoom } from '@/types/chat';
import { formatMeetDateTime } from '@/pages/MeetChat/utils/format';

type MeetChatSummaryProps = {
  room: MeetChatRoom;
  joinedCount: number;
  totalCount: number;
};

function MeetChatSummary({ room, joinedCount, totalCount }: MeetChatSummaryProps) {
  return (
    <section className="shrink-0 px-[14px] pt-4">
      <RoughBorder
        fill="color-mix(in srgb, var(--color-dark-background) 46%, transparent)"
        containerClassName="w-full"
        className="px-5 py-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[12px] leading-[15px] font-medium text-dark-border">
              {room.groupName || '약속'}
            </p>
            <h1 className="mt-1 truncate text-[22px] leading-[27px] font-semibold text-text">
              {room.roomName}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-border/40 px-2.5 py-1 text-[12px] leading-[15px] font-semibold text-dark-border">
            <Users size={13} strokeWidth={2} />
            {joinedCount}/{totalCount}
          </div>
        </div>

        <div className="mt-4 grid gap-2 border-t border-dashed border-border/50 pt-3">
          <div className="flex items-center gap-2 text-[13px] leading-[16px] text-dark-border">
            <CalendarDays size={15} strokeWidth={1.8} />
            <span>{room.promiseDate ? formatMeetDateTime(room.promiseDate) : '일정 미정'}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] leading-[16px] text-dark-border">
            <MapPin size={15} strokeWidth={1.8} />
            <span className="truncate">{room.location || '장소 미정'}</span>
          </div>
        </div>
      </RoughBorder>
    </section>
  );
}

export default MeetChatSummary;
