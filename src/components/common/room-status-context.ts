import { createContext } from 'react';
import type { GroupRole } from '@/types/group';
import type { RoomPhase } from '@/features/schedule/types/schedule';

export const RoomStatusContext = createContext<{
  phase: RoomPhase | null;
  role: GroupRole | null;
}>({
  phase: null,
  role: null,
});
