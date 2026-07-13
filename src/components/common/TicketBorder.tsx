import type { ReactNode } from 'react';
import { Card } from '@/components/shadcn/card';
import ScallopedEdge from '@/components/common/ScallopedEdge';
import { cn } from '@/lib/utils';

type TicketBorderProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

function TicketBorder({ children, className, contentClassName }: TicketBorderProps) {
  return (
    <Card
      className={cn(
        'relative flex min-h-[calc(100vh-48px)] w-full flex-col gap-0 overflow-visible rounded-none border-x border-background bg-background px-[25px] py-10 shadow-none ring-0',
        className,
      )}
    >
      <ScallopedEdge position="top" />
      <div className={cn('flex w-full flex-1 flex-col', contentClassName)}>{children}</div>
      <ScallopedEdge position="bottom" />
    </Card>
  );
}

export default TicketBorder;
