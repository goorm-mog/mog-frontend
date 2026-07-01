import { cn } from '@/lib/utils';

export type ToastType = 'error' | 'success' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
}

const TOAST_STYLES: Record<ToastType, string> = {
  error: 'bg-alert text-background',
  success: 'bg-dark-border text-background',
  info: 'bg-dark-background text-text',
};

function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={cn(
        'w-full py-3 px-4 rounded-lg font-pretendard text-[13px] leading-snug',
        'animate-in slide-in-from-bottom-2 fade-in-0 duration-200 ease-out',
        TOAST_STYLES[type],
      )}
    >
      {message}
    </div>
  );
}

export default Toast;
