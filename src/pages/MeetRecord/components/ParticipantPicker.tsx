import { AddMemberAvatar, MemberAvatar } from '@/components/common/MemberAvatar';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import type { ReceiptParticipant } from '@/pages/MeetRecord/types';

type ParticipantPickerProps = {
  participants: ReceiptParticipant[];
  onParticipantToggle: (participantId: number) => void;
};

function ParticipantPicker({
  participants,
  onParticipantToggle,
}: ParticipantPickerProps) {
  const participantScrollRef = useWheelScrollSensitivity<HTMLDivElement>('x');

  return (
    <div
      ref={participantScrollRef}
      className="flex items-start gap-3 overflow-x-auto pb-1 pt-2 promise-scrollbar-hidden"
    >
      <AddMemberAvatar
        size="md"
        borderWeight="thin"
        aria-label="참가자 추가"
      />

      {participants.map((participant) => (
        <MemberAvatar
          key={participant.id}
          name={participant.name}
          size="md"
          borderWeight="thin"
          selected={Boolean(participant.selected)}
          showCheck
          tone="default"
          unselectedTone="muted"
          onClick={() => onParticipantToggle(participant.id)}
        />
      ))}
    </div>
  );
}

export default ParticipantPicker;
