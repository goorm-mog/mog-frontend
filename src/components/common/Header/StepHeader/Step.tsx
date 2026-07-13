const STEPS = [
  { number: 1, label: '날짜 및 시간 선택' },
  { number: 2, label: '출발지 입력' },
  { number: 3, label: '장소 확정' },
];

interface StepProps {
  currentStep?: number;
}

function Step({ currentStep = 1 }: StepProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative flex justify-around">
        <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%/6)] right-[calc(100%/6)] border-t border-dashed border-border" />
        {STEPS.map((step) => (
          <div
            key={step.number}
            className={
              step.number === currentStep
                ? 'relative z-10 bg-point size-8 rounded-full flex items-center justify-center text-background text-caption'
                : 'relative z-10 bg-background border-[0.5px] border-dark-border size-8 rounded-full flex items-center justify-center text-dark-border text-caption'
            }
          >
            {step.number}
          </div>
        ))}
      </div>
      <div className="flex justify-around">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="w-1/3 font-pretendard font-normal text-[9px] text-dark-border text-center"
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Step;
