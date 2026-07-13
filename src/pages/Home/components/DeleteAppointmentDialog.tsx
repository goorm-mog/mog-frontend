import { Button } from '@/components/common/Button';

type DeleteAppointmentDialogProps = {
  appointmentName: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteAppointmentDialog({
  appointmentName,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteAppointmentDialogProps) {
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
        aria-labelledby="delete-appointment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-appointment-title" className="text-body text-text">
          약속 삭제
        </h2>
        <p className="mt-3 text-caption text-[#4a463f]">
          <span className="font-medium text-text">{appointmentName}</span> 약속을 삭제하시겠습니까?
        </p>

        <footer className="mt-6 flex gap-3 pt-4">
          <Button
            variant="dark"
            size="lg"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            아니오
          </Button>
          <Button
            variant="point"
            size="lg"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? '삭제 중...' : '예'}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default DeleteAppointmentDialog;
