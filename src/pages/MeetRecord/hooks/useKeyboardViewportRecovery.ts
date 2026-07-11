import { useEffect } from 'react';

function isTextEntryElement(element: EventTarget | null) {
  if (!(element instanceof HTMLElement)) return false;

  const tagName = element.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || element.isContentEditable;
}

function resetDocumentScroll() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function useKeyboardViewportRecovery() {
  useEffect(() => {
    let wasEditingText = false;
    let lastViewportHeight = window.visualViewport?.height ?? window.innerHeight;
    let recoveryTimer: number | null = null;

    const scheduleRecovery = () => {
      if (recoveryTimer) {
        window.clearTimeout(recoveryTimer);
      }

      recoveryTimer = window.setTimeout(resetDocumentScroll, 80);
    };

    const handleFocusIn = (event: FocusEvent) => {
      wasEditingText = isTextEntryElement(event.target);
    };

    const handleFocusOut = () => {
      if (!wasEditingText) return;

      wasEditingText = false;
      scheduleRecovery();
    };

    const handleViewportResize = () => {
      const nextViewportHeight = window.visualViewport?.height ?? window.innerHeight;

      if (!wasEditingText && nextViewportHeight > lastViewportHeight) {
        scheduleRecovery();
      }

      lastViewportHeight = nextViewportHeight;
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      if (recoveryTimer) {
        window.clearTimeout(recoveryTimer);
      }

      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, []);
}
