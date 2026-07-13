import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchGroupDetail } from '@/api/group';
import { fetchGroupRooms, fetchRoomSummary } from '@/api/room';
import { ApiError } from '@/lib/apiFetch';
import { setRoomRole } from '@/lib/auth-storage';
import type { GroupRole, HomeGroup } from '@/types/group';
import type { RoomInfo, RoomSummary } from '@/types/room';
import {
  clearResolvedPendingRooms,
  readPendingRooms,
} from '@/pages/Home/utils/homeStorage';
import { mergeRooms, toRoomInfoFromDetail } from '@/pages/Home/utils/homeRoomUtils';

type GroupMetaOptions = { inviteCode?: string; kakaoShareUrl?: string };

type UseHomeRoomsOptions = {
  groups: HomeGroup[];
  isGroupsLoading: boolean;
  selectedGroupId: number | null;
  onGroupMeta: (groupId: number, role: GroupRole, options?: GroupMetaOptions) => void;
  showToast: (message: string) => void;
};

export function useHomeRooms({
  groups,
  isGroupsLoading,
  selectedGroupId,
  onGroupMeta,
  showToast,
}: UseHomeRoomsOptions) {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loadedGroupId, setLoadedGroupId] = useState<number | null>(null);
  const [roomSummaries, setRoomSummaries] = useState<Record<number, RoomSummary>>({});
  const [summariesGroupId, setSummariesGroupId] = useState<number | null>(null);

  const fetchMergedGroupRooms = useCallback(async (groupId: number) => {
    const [listedRooms, detail] = await Promise.all([
      fetchGroupRooms(groupId),
      fetchGroupDetail(groupId).catch(() => null),
    ]);
    const detailRooms =
      detail?.rooms?.map(toRoomInfoFromDetail).filter((room): room is RoomInfo => room !== null) ??
      [];
    const apiRooms = mergeRooms(listedRooms, detailRooms);
    clearResolvedPendingRooms(groupId, apiRooms);
    return { nextRooms: mergeRooms(apiRooms, readPendingRooms(groupId)), detail };
  }, []);

  const applyResult = useCallback(
    (groupId: number, result: Awaited<ReturnType<typeof fetchMergedGroupRooms>>) => {
      if (result.detail) {
        onGroupMeta(groupId, result.detail.myRole, { inviteCode: result.detail.inviteCode });
        result.nextRooms.forEach((room) => setRoomRole(room.roomId, result.detail!.myRole));
      }
      return result.nextRooms;
    },
    [onGroupMeta],
  );

  const refreshSelectedRooms = useCallback(async () => {
    if (selectedGroupId === null) return [];
    const result = await fetchMergedGroupRooms(selectedGroupId);
    const nextRooms = applyResult(selectedGroupId, result);
    setRooms(nextRooms);
    setLoadedGroupId(selectedGroupId);
    return nextRooms;
  }, [selectedGroupId, fetchMergedGroupRooms, applyResult]);

  useEffect(() => {
    if (isGroupsLoading) return;
    let ignore = false;

    const request =
      selectedGroupId === null
        ? Promise.allSettled(groups.map((group) => fetchMergedGroupRooms(group.id))).then(
            (settled) => {
              const successfulRooms: RoomInfo[][] = [];
              settled.forEach((entry, index) => {
                if (entry.status !== 'fulfilled') return;
                const groupId = groups[index]?.id;
                if (groupId === undefined) return;
                successfulRooms.push(applyResult(groupId, entry.value));
              });
              if (settled.some((entry) => entry.status === 'rejected')) {
                showToast('일부 그룹의 약속을 불러오지 못했어요');
              }
              return mergeRooms(...successfulRooms);
            },
          )
        : fetchMergedGroupRooms(selectedGroupId).then((result) =>
            applyResult(selectedGroupId, result),
          );

    request
      .then((nextRooms) => {
        if (ignore) return;
        setRooms(nextRooms);
        setLoadedGroupId(selectedGroupId);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        showToast(error instanceof ApiError ? error.message : '약속 목록을 불러오지 못했어요');
        setRooms(selectedGroupId === null ? [] : readPendingRooms(selectedGroupId));
        setLoadedGroupId(selectedGroupId);
      })
      .finally(() => undefined);

    return () => {
      ignore = true;
    };
  }, [selectedGroupId, isGroupsLoading, groups, fetchMergedGroupRooms, applyResult, showToast]);

  const activeRooms = useMemo(
    () => (loadedGroupId === selectedGroupId ? rooms : []),
    [loadedGroupId, selectedGroupId, rooms],
  );
  const completedRooms = useMemo(
    () => activeRooms.filter((room) => room.status === 'COMPLETED'),
    [activeRooms],
  );

  useEffect(() => {
    if (completedRooms.length === 0) {
      return;
    }
    let ignore = false;
    Promise.all(
      completedRooms.map((room) =>
        fetchRoomSummary(room.roomId)
          .then((summary) => [room.roomId, summary] as const)
          .catch(() => null),
      ),
    ).then((entries) => {
      if (ignore) return;
      setRoomSummaries(Object.fromEntries(entries.filter((entry) => entry !== null)));
      setSummariesGroupId(selectedGroupId);
    });
    return () => {
      ignore = true;
    };
  }, [selectedGroupId, completedRooms]);

  return {
    rooms: activeRooms,
    isLoading: isGroupsLoading || loadedGroupId !== selectedGroupId,
    roomSummaries:
      completedRooms.length > 0 && summariesGroupId === selectedGroupId ? roomSummaries : {},
    refreshSelectedRooms,
    setRooms,
  };
}
