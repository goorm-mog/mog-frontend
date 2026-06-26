import { Check, Cloud, Plus } from 'lucide-react';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import type { ReceiptParticipant } from '@/pages/MeetRecord/types';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

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
      className="flex items-start gap-3 overflow-x-auto pb-1 pt-1 promise-scrollbar-hidden"
    >
      <button
        type="button"
        className="grid size-[62px] shrink-0 place-items-center rounded-full border-[3px] border-dashed"
        style={{ borderColor: colors.border, color: colors.text }}
        aria-label="참가자 추가"
      >
        <Plus className="size-8" strokeWidth={2.2} />
      </button>

      {participants.map((participant) => (
        <button
          key={participant.id}
          type="button"
          className="w-[64px] shrink-0 text-center"
          aria-pressed={participant.selected}
          onClick={() => onParticipantToggle(participant.id)}
        >
          <div
            className={`relative mx-auto grid size-[62px] place-items-center rounded-full border-[3px] ${
              participant.selected ? '' : 'border-dashed'
            }`}
            style={{
              borderColor: participant.selected ? colors.text : colors.border,
              backgroundColor: participant.selected ? colors.background : 'transparent',
              color: colors.text,
            }}
          >
            <Cloud className="size-10" strokeWidth={2.2} />
            {participant.selected ? (
              <span
                className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full"
                style={{ backgroundColor: colors.text, color: colors.background }}
              >
                <Check className="size-4" strokeWidth={3} />
              </span>
            ) : null}
          </div>
          <p className={`${typography.caption} mt-2`} style={{ color: colors.text }}>
            {participant.name}
          </p>
        </button>
      ))}
    </div>
  );
}

export default ParticipantPicker;
