import { useRef } from 'react';

const SWIPE_THRESHOLD = 50;

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const startXRef = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - startXRef.current;
    startXRef.current = null;
    if (deltaX < -SWIPE_THRESHOLD) onSwipeLeft();
    else if (deltaX > SWIPE_THRESHOLD) onSwipeRight();
  };

  return { onTouchStart, onTouchEnd };
}
