import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse bg-dark-background rounded-lg', className)} />;
}

export default Skeleton;
