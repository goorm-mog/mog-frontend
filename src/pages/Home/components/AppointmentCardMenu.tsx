import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';

type AppointmentCardMenuProps = {
  appointmentName: string;
  onDelete: () => void;
};

function AppointmentCardMenu({ appointmentName, onDelete }: AppointmentCardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="relative shrink-0"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
      }}
    >
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-dark-border hover:bg-dark-background/50 hover:text-text"
        aria-label={`${appointmentName} 더보기`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <MoreHorizontal size={18} strokeWidth={2} />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[112px] rounded-lg border border-border/50 bg-background py-1 shadow-[0px_4px_16px_rgba(0,0,0,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-caption text-alert hover:bg-dark-background/30"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
          >
            <Trash2 size={14} strokeWidth={2} />
            삭제
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AppointmentCardMenu;
