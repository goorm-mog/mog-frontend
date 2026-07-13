import { useCallback, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RoomStatusContext } from '@/components/common/RoomGuard';
import type { RoomPhase } from '@/features/schedule/types/schedule';

function phaseToStep(phase: RoomPhase | null): number {
  switch (phase) {
    case 'DEPARTURE_INPUT':
    case 'MIDPOINT_FINDING':
      return 2;
    case 'COMPLETED':
      return 3;
    case 'WAITING':
    case 'SCHEDULE_VOTING':
    default:
      return 1;
  }
}

const STEP_PATH = {
  1: 'reschedule',
  2: 'departure',
  3: 'midpoint',
} as const;

export function useRoomStepNavigation(currentStep: number) {
  const { roomId } = useParams<{ roomId: string }>();
  const { phase, role } = useContext(RoomStatusContext);
  const location = useLocation();
  const navigate = useNavigate();
  const maxStep = phase === null ? currentStep : Math.max(currentStep, phaseToStep(phase));
  const variant =
    role === 'LEADER' || location.pathname.includes('/host/') ? 'host' : 'participant';

  const handleStepClick = useCallback(
    (step: number) => {
      if (!roomId || step < 1 || step > maxStep || step === currentStep) return;
      const path = STEP_PATH[step as keyof typeof STEP_PATH];
      if (path) navigate(`/${path}/${variant}/${roomId}`);
    },
    [currentStep, maxStep, navigate, roomId, variant],
  );

  return { maxStep, onStepClick: handleStepClick };
}
