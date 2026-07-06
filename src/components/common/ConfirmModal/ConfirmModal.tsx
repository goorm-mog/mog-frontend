interface ConfirmModalProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmModal({
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/40"
      onClick={onClose}
    >
      <div
        className="mx-6 bg-background rounded-2xl p-6 flex flex-col gap-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <p className="font-pretendard font-semibold text-[18px] leading-snug text-text">
            {title}
          </p>
          {description && (
            <p className="font-pretendard text-sm text-dark-border leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-md border border-point text-point font-pretendard text-sm font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-md bg-point text-background font-pretendard text-sm font-medium"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
