const STEPS = [
  { number: 1, label: '날짜 및 시간 선택' },
  { number: 2, label: '출발지 입력' },
  { number: 3, label: '장소 확정' },
];

interface StepProps {
  currentStep?: number;
  maxStep?: number;
  onStepClick?: (step: number) => void;
}

function Step({ currentStep = 1, maxStep = currentStep, onStepClick }: StepProps) {
  return (
    <div className="relative flex w-full">
      <div className="absolute top-4 left-[calc(100%/6)] right-[calc(100%/6)] border-t border-dashed border-border" />
      {STEPS.map((step) => {
        const isCurrent = step.number === currentStep;
        const isAvailable = step.number <= maxStep;
        const isClickable = isAvailable && !isCurrent && Boolean(onStepClick);

        return (
          <button
            key={step.number}
            type="button"
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={`${step.number}단계 ${step.label}${isAvailable ? '' : ' (진행 전)'}`}
            disabled={!isClickable}
            onClick={() => onStepClick?.(step.number)}
            className={`relative z-10 flex w-1/3 flex-col items-center gap-2 bg-transparent ${
              isClickable ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <span
              className={
                isCurrent
                  ? 'flex size-8 items-center justify-center rounded-full bg-point text-caption text-background'
                  : 'flex size-8 items-center justify-center rounded-full border-[0.5px] border-dark-border bg-background text-caption text-dark-border'
              }
            >
              {step.number}
            </span>
            <span
              className={`font-pretendard text-center text-[9px] font-normal ${
                isAvailable ? 'text-dark-border' : 'text-border'
              }`}
            >
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default Step;
