import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchRoomMembers } from '@/features/schedule/api/schedule';
import { fetchDepartures } from '@/features/departure/api/departure';
import { getMyUserId } from '@/lib/auth-storage';
import type { DepartureEntry } from '@/features/departure/types/departure';

export type DepartureProfileMember = {
  userId: number;
  nickname: string;
  isHost: boolean;
  isMe: boolean;
  isSubmitted: boolean;
};

export function useDeparture(roomId: number) {
  const [members, setMembers] = useState<DepartureProfileMember[]>([]);
  const [departures, setDepartures] = useState<DepartureEntry[]>([]);
  const [myDeparture, setMyDeparture] = useState<DepartureEntry | null>(null);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const loadIdRef = useRef(0);

  const load = useCallback(() => {
    const myUserId = getMyUserId();
    const currentLoadId = ++loadIdRef.current;

    Promise.all([fetchRoomMembers(roomId), fetchDepartures(roomId)])
      .then(([membersRes, departuresRes]) => {
        if (currentLoadId !== loadIdRef.current) return;
        setIsError(false);
        const submittedUserIds = new Set(departuresRes.departures.map((d) => d.userId));
        setMembers(
          membersRes.members.map((m) => ({
            userId: m.userId,
            nickname: m.nickname,
            isHost: m.role === 'HOST',
            isMe: m.userId === myUserId,
            isSubmitted: submittedUserIds.has(m.userId),
          })),
        );
        setDepartures(departuresRes.departures);
        setMyDeparture(departuresRes.departures.find((d) => d.userId === myUserId) ?? null);
        setSubmittedCount(departuresRes.submittedCount);
        setTotalParticipants(membersRes.members.length);
        setIsLoading(false);
      })
      .catch(() => {
        if (currentLoadId !== loadIdRef.current) return;
        setIsError(true);
        setIsLoading(false);
      });
  }, [roomId]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    members,
    departures,
    myDeparture,
    submittedCount,
    totalParticipants,
    isLoading,
    isError,
    refetch,
  };
}
