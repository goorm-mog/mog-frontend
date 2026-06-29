import RoughBorder from '../../RoughBorder';
import TextLogo from './TextLogo';
import Step from './Step';

interface StepHeaderProps {
  className?: string;
}

function StepHeader({ className }: StepHeaderProps) {
  return (
    <div className="p-4">
      <RoughBorder
        fill="color-mix(in srgb, var(--color-dark-background) 50%, transparent)"
        containerClassName={className}
        className="flex flex-col justify-center items-center gap-2"
      >
        <TextLogo />
        <Step />
      </RoughBorder>
    </div>
  );
}

export default StepHeader;
