import { Paperclip, Send } from 'lucide-react';

type MeetChatComposerProps = {
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

function MeetChatComposer({
  value,
  placeholder,
  disabled = false,
  onChange,
  onSubmit,
}: MeetChatComposerProps) {
  const canSubmit = value.trim().length > 0 && !disabled;

  return (
    <form
      className="shrink-0 bg-background px-[14px] pt-3 pb-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) onSubmit();
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
          value={value}
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="submit"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-text text-background disabled:bg-border"
          aria-label="메시지 전송"
          disabled={!canSubmit}
        >
          <Send size={16} strokeWidth={2.2} />
        </button>
      </div>
    </form>
  );
}

export default MeetChatComposer;
