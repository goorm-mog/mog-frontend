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
      className="flex items-start gap-3 overflow-x-auto pb-1 pt-2 promise-scrollbar-hidden"
    >
      <button
        type="button"
        className="grid size-[45px] shrink-0 place-items-center rounded-full border-[3px] border-dashed"
        style={{ borderColor: colors.border, color: colors.text }}
        aria-label="참가자 추가"
      >
        <Plus className="size-6" strokeWidth={2.2} />
      </button>

      {participants.map((participant) => (
        <button
          key={participant.id}
          type="button"
          className="w-[45px] shrink-0 text-center"
          aria-pressed={participant.selected}
          onClick={() => onParticipantToggle(participant.id)}
        >
          <div
            className={`relative mx-auto grid size-[45px] place-items-center rounded-full border-[2.5px] ${
              participant.selected ? '' : 'border-dashed'
            }`}
            style={{
              borderColor: participant.selected ? colors.text : colors.border,
              backgroundColor: participant.selected ? colors.background : 'transparent',
              color: colors.text,
            }}
          >
            <Cloud className="size-7" strokeWidth={2.2} />
            {participant.selected ? (
              <span
                className="absolute -right-1 -top-2 grid size-5 place-items-center rounded-full"
                style={{ backgroundColor: colors.text, color: colors.background }}
              >
                <Check className="size-3" strokeWidth={3} />
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
