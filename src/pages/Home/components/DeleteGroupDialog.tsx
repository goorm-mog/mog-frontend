import { Button } from '@/components/common/Button';

type DeleteGroupDialogProps = {
  groupName: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteGroupDialog({
  groupName,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteGroupDialogProps) {
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
        aria-labelledby="delete-group-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-group-title" className="text-body text-text">
          그룹 삭제
        </h2>
        <p className="mt-3 text-caption text-[#4a463f]">
          <span className="font-medium text-text">{groupName}</span> 그룹을 삭제할까요?
          <br />
          삭제하면 복구할 수 없습니다.
        </p>

        <footer className="mt-6 flex gap-3 pt-4">
          <Button variant="dark" size="lg" onClick={onClose} disabled={isLoading} className="flex-1">
            취소
          </Button>
          <Button variant="point" size="lg" onClick={onConfirm} disabled={isLoading} className="flex-1">
            {isLoading ? '삭제 중...' : '삭제'}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default DeleteGroupDialog;
