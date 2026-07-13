import { Button } from '@/components/common/Button';

type LeaveGroupDialogProps = {
  groupName: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function LeaveGroupDialog({
  groupName,
  isLoading = false,
  onClose,
  onConfirm,
}: LeaveGroupDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 px-6"
      role="presentation"
      onClick={isLoading ? undefined : onClose}
    >
      <div
        className="w-full max-w-[320px] rounded-lg border border-border bg-background p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-group-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="leave-group-title" className="text-body text-text">
          그룹 탈퇴
        </h2>
        <p className="mt-3 text-caption text-[#4a463f]">
          <span className="font-medium text-text">{groupName}</span> 그룹에서 탈퇴할까요?
        </p>

        <footer className="mt-6 flex gap-3 pt-4">
          <Button variant="dark" size="lg" onClick={onClose} disabled={isLoading} className="flex-1">
            취소
          </Button>
          <Button variant="point" size="lg" onClick={onConfirm} disabled={isLoading} className="flex-1">
            {isLoading ? '탈퇴 중...' : '탈퇴'}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default LeaveGroupDialog;
