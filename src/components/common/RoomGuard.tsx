import { createContext, useCallback, useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { fetchRoomMembers, fetchRoomProgress } from '@/features/schedule/api/schedule';
import { getMyUserId, getRoomRole } from '@/lib/auth-storage';
import type { GroupRole } from '@/types/group';
import type { RoomPhase } from '@/features/schedule/types/schedule';

export const RoomStatusContext = createContext<{ phase: RoomPhase | null; role: GroupRole | null }>(
  {
    phase: null,
    role: null,
  },
);

function toExpectedPath(roomId: number, phase: RoomPhase, role: GroupRole): string {
  const variant = role === 'LEADER' ? 'host' : 'participant';
  switch (phase) {
    case 'WAITING':
    case 'SCHEDULE_VOTING':
      return `/reschedule/${variant}/${roomId}`;
    case 'DEPARTURE_INPUT':
    case 'MIDPOINT_FINDING':
      return `/departure/${variant}/${roomId}`;
    case 'COMPLETED':
      return `/midpoint/${variant}/${roomId}`;
  }
}

function toExpectedPathByRole(currentPath: string, roomId: number, role: GroupRole): string {
  const correct = role === 'LEADER' ? 'host' : 'participant';
  const wrong = role === 'LEADER' ? 'participant' : 'host';
  return currentPath.includes(`/${wrong}/${roomId}`)
    ? currentPath.replace(`/${wrong}/${roomId}`, `/${correct}/${roomId}`)
    : currentPath;
}

function pathStep(path: string): number | null {
  if (path.includes('/reschedule/')) return 1;
  if (path.includes('/departure/')) return 2;
  if (path.includes('/midpoint/')) return 3;
  return null;
}

function phaseStep(phase: RoomPhase): number {
  switch (phase) {
    case 'DEPARTURE_INPUT':
    case 'MIDPOINT_FINDING':
      return 2;
    case 'COMPLETED':
      return 3;
    default:
      return 1;
  }
}

interface RoomGuardProps {
  children: React.ReactNode;
}

function RoomGuard({ children }: RoomGuardProps) {
  const { roomId: roomIdStr } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdStr);
  const location = useLocation();

  const [expectedPath, setExpectedPath] = useState<string | null>(null);
  const [resolvedPhase, setResolvedPhase] = useState<RoomPhase | null>(null);
  const [resolvedRole, setResolvedRole] = useState<GroupRole | null>(null);

  const checkStatus = useCallback(() => {
    const currentPath = location.pathname;

    const handleRole = async (role: GroupRole) => {
      try {
        const progress = await fetchRoomProgress(roomId);
        setResolvedPhase(progress.status);
        setResolvedRole(role);
        const requestedStep = pathStep(currentPath);
        const canVisitRequestedStep =
          requestedStep !== null && requestedStep <= phaseStep(progress.status);
        setExpectedPath(
          canVisitRequestedStep
            ? toExpectedPathByRole(currentPath, roomId, role)
            : toExpectedPath(roomId, progress.status, role),
        );
      } catch {
        setResolvedRole(role);
        setExpectedPath(toExpectedPathByRole(currentPath, roomId, role));
      }
    };

    const storedRole = getRoomRole(roomId);
    if (storedRole !== null) {
      handleRole(storedRole);
    } else {
      const myUserId = getMyUserId();
      fetchRoomMembers(roomId)
        .then(({ members }) => {
          const me = members.find((m) => m.userId === myUserId);
          const role: GroupRole = me?.role ?? 'MEMBER';
          handleRole(role);
        })
        .catch(() => setExpectedPath(currentPath));
    }
  }, [roomId, location.pathname]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') checkStatus();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [checkStatus]);

  if (expectedPath === null) {
    return <div className="min-h-screen bg-background animate-pulse" />;
  }

  if (expectedPath !== location.pathname) {
    return <Navigate to={expectedPath} replace />;
  }

  return (
    <RoomStatusContext.Provider value={{ phase: resolvedPhase, role: resolvedRole }}>
      {children}
    </RoomStatusContext.Provider>
  );
}

export default RoomGuard;
