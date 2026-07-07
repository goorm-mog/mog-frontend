type SettlementCompletionDialogProps = {
  countdownSeconds: number;
};

function SettlementCompletionDialog({
  countdownSeconds,
}: SettlementCompletionDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/45 px-[24px]"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-[320px] rounded-[8px] border border-border bg-background px-5 py-5 text-center shadow-[0_18px_36px_rgba(27,26,18,0.22)]">
        <p className="text-[16px] leading-[24px] font-semibold text-text">
          정산이 완료되었습니다.
        </p>
        <p className="mt-3 text-[13px] leading-[18px] font-medium text-dark-border">
          3초뒤에 기록을 보여드릴게요
        </p>
        <p className="mt-2 font-dm-mono text-[18px] leading-[22px] font-semibold text-point">
          {countdownSeconds}
        </p>
      </div>
    </div>
  );
}

export default SettlementCompletionDialog;
