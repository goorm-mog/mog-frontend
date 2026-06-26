import { useEffect, useRef } from 'react';

const WHEEL_SCROLL_SENSITIVITY = 0.35;

type ScrollAxis = 'x' | 'y';

function canScroll(element: HTMLElement, axis: ScrollAxis) {
  if (axis === 'x') {
    return element.scrollWidth > element.clientWidth;
  }

  return element.scrollHeight > element.clientHeight;
}

function findNearestScrollableElement(
  target: EventTarget | null,
  boundary: HTMLElement,
  axis: ScrollAxis,
) {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  let element: HTMLElement | null = target;

  while (element) {
    if (canScroll(element, axis)) {
      return element;
    }

    if (element === boundary) {
      return null;
    }

    element = element.parentElement;
  }

  return null;
}

function getWheelDistance(event: WheelEvent, axis: ScrollAxis, element: HTMLElement) {
  const rawDelta = axis === 'x' ? event.deltaX : event.deltaY;
  const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight) || 16;

  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return rawDelta * lineHeight;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return rawDelta * element.clientHeight;
  }

  return rawDelta;
}

function useWheelScrollSensitivity<T extends HTMLElement>(axis: ScrollAxis = 'y') {
  const scrollRef = useRef<T | null>(null);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const scrollableElement = findNearestScrollableElement(
        event.target,
        element,
        axis,
      );

      if (scrollableElement !== element) {
        return;
      }

      const distance = getWheelDistance(event, axis, element);

      if (distance === 0) {
        return;
      }

      event.preventDefault();

      if (axis === 'x') {
        element.scrollLeft += distance * WHEEL_SCROLL_SENSITIVITY;
        return;
      }

      element.scrollTop += distance * WHEEL_SCROLL_SENSITIVITY;
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [axis]);

  return scrollRef;
}

export default useWheelScrollSensitivity;
