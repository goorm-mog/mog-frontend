interface VoteCountBadgeProps {
  votedCount: number;
  totalParticipants: number;
}

function VoteCountBadge({ votedCount, totalParticipants }: VoteCountBadgeProps) {
  return (
    <span className="font-pretendard text-[12px] shrink-0">
      <span className="text-point">{votedCount}</span>
      <span className="text-dark-border">/{totalParticipants}</span>
    </span>
  );
}

export default VoteCountBadge;
