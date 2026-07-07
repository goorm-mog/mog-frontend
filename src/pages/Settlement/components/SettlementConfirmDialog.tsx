import Button from '@/components/common/Button/Button';

type SettlementConfirmDialogProps = {
  onClose: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
};

function SettlementConfirmDialog({
  onClose,
  onConfirm,
  isConfirming = false,
}: SettlementConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-text/45 px-[14px] pb-7"
      role="presentation"
      onClick={isConfirming ? undefined : onClose}
    >
      <section
        className="w-full max-w-[402px] rounded-[8px] border border-border bg-background px-5 pt-5 pb-4 shadow-[0_18px_36px_rgba(27,26,18,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settlement-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="settlement-confirm-title"
          className="text-[18px] leading-[24px] font-semibold text-text"
        >
          이대로 진행할까요?
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="dark"
            size="md"
            className="bg-dark-background text-text"
            onClick={onClose}
            disabled={isConfirming}
          >
            취소
          </Button>
          <Button variant="point" size="md" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? '처리 중...' : '확인'}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default SettlementConfirmDialog;
