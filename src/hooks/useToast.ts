import { useContext } from 'react';
import { ToastContext } from '@/contexts/ToastContext';

export type { ToastType } from '@/components/ui/Toast';

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast는 ToastProvider 안에서 사용해야 합니다.');
  return ctx;
}
