import { cn } from '@/lib/utils';

type ScallopedEdgeProps = {
  position: 'top' | 'bottom';
  className?: string;
};

function ScallopedEdge({ position, className }: ScallopedEdgeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'ticket-edge',
        position === 'top' ? 'ticket-edge-top' : 'ticket-edge-bottom',
        className,
      )}
    />
  );
}

export default ScallopedEdge;
