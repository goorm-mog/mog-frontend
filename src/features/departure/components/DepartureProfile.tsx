import { useState } from 'react';
import MemberAvatar from '@/components/common/MemberAvatar/MemberAvatar';
import VoteCountBadge from '@/components/common/VoteCountBadge/VoteCountBadge';
import type { DepartureProfileMember } from '@/features/departure/hooks/useDeparture';
import type { DepartureEntry } from '@/features/departure/types/departure';
import { getMyProfileImageUrl } from '@/lib/auth-storage';

interface DepartureProfileProps {
  members: DepartureProfileMember[];
  departures: DepartureEntry[];
  submittedCount: number;
  totalParticipants: number;
  isLoading: boolean;
  onMemberSelect: (memberId: number, departure: DepartureEntry | null) => void;
}

function DepartureProfile({
  members,
  departures,
  submittedCount,
  totalParticipants,
  isLoading,
  onMemberSelect,
}: DepartureProfileProps) {
  const myMember = members.find((m) => m.isMe);
  const myMemberId = myMember?.userId ?? null;
  const [selectedId, setSelectedId] = useState<number | null>(myMemberId);
  const [prevMyMemberId, setPrevMyMemberId] = useState<number | null>(myMemberId);

  if (prevMyMemberId !== myMemberId) {
    setPrevMyMemberId(myMemberId);
    setSelectedId(myMemberId);
  }

  const sortedMembers = [...members].sort((a, b) => {
    if (a.isMe !== b.isMe) return a.isMe ? -1 : 1;
    if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
    return 0;
  });

  const handleClick = (member: DepartureProfileMember) => {
    const isDeselect = selectedId === member.userId;
    if (isDeselect && myMember) {
      setSelectedId(myMember.userId);
      const myDeparture = departures.find((d) => d.userId === myMember.userId) ?? null;
      onMemberSelect(myMember.userId, myDeparture);
      return;
    }

    setSelectedId(member.userId);
    const departure = departures.find((d) => d.userId === member.userId) ?? null;
    onMemberSelect(member.userId, departure);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex gap-4 items-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="w-8 h-2 rounded bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="w-8 h-3 rounded bg-gray-200 animate-pulse mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-start">
          {sortedMembers.map((member) => (
            <MemberAvatar
              key={member.userId}
              name={member.nickname}
              profileImageUrl={member.isMe ? getMyProfileImageUrl() : undefined}
              size="sm"
              subLabel={member.isHost ? '방장' : undefined}
              tone={member.isMe ? 'point' : 'default'}
              unselectedTone={member.isMe ? 'point' : 'muted'}
              selected={selectedId === member.userId}
              showCheck={member.isSubmitted}
              onClick={() => handleClick(member)}
            />
          ))}
        </div>
        <div className="flex items-center gap-0.5 pt-1 whitespace-nowrap">
          <VoteCountBadge votedCount={submittedCount} totalParticipants={totalParticipants} />
        </div>
      </div>
    </div>
  );
}

export default DepartureProfile;
