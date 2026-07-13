import { useParams } from 'react-router-dom';

export function parsePositiveRoomId(roomIdParam: string | undefined) {
  if (!roomIdParam) return null;

  const roomId = Number(roomIdParam);
  return Number.isInteger(roomId) && roomId > 0 ? roomId : null;
}

export function useRouteRoomId() {
  const { roomId } = useParams<{ roomId: string }>();

  return parsePositiveRoomId(roomId);
}
