import { useState } from 'react';

export type HomeOverlay =
  | 'sidebar'
  | 'notifications'
  | 'createGroup'
  | 'joinGroup'
  | 'inviteGroup'
  | 'editGroup'
  | 'deleteGroup'
  | 'leaveGroup'
  | 'createAppointment';

export function useHomeOverlays() {
  const [activeOverlay, setActiveOverlay] = useState<HomeOverlay | null>(null);
  return {
    activeOverlay,
    isOpen: (overlay: HomeOverlay) => activeOverlay === overlay,
    open: setActiveOverlay,
    close: () => setActiveOverlay(null),
  };
}
