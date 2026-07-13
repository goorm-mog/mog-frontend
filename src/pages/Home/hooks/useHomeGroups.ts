import { useCallback, useEffect, useState } from 'react';
import {
  createGroup,
  deleteGroup,
  fetchGroups,
  joinGroup,
  leaveGroup,
  updateGroup,
} from '@/api/group';
import { ApiError } from '@/lib/apiFetch';
import type { GroupRole, HomeGroup } from '@/types/group';
import {
  readDeletedGroupIds,
  readGroupRoles,
  reconcileHiddenGroupIds,
  visibleGroups,
  writeDeletedGroupIds,
  writeGroupRole,
} from '@/pages/Home/utils/homeStorage';

type GroupMeta = { role: GroupRole; inviteCode: string; kakaoShareUrl: string };

export function useHomeGroups(showToast: (message: string) => void) {
  const [groups, setGroups] = useState<HomeGroup[]>([]);
  const [deletedGroupIds, setDeletedGroupIds] = useState(readDeletedGroupIds);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groupMetaById, setGroupMetaById] = useState<Record<number, GroupMeta>>(() =>
    Object.fromEntries(
      Object.entries(readGroupRoles())
        .filter((entry): entry is [string, GroupRole] => entry[1] !== undefined)
        .map(([id, role]) => [Number(id), { role, inviteCode: '', kakaoShareUrl: '' }]),
    ),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const upsertGroupMeta = useCallback(
    (groupId: number, role: GroupRole, options?: Partial<Omit<GroupMeta, 'role'>>) => {
      writeGroupRole(groupId, role);
      setGroupMetaById((prev) => {
        const current = prev[groupId];
        const inviteCode = options?.inviteCode ?? current?.inviteCode ?? '';
        return {
          ...prev,
          [groupId]: {
            role,
            inviteCode,
            kakaoShareUrl:
              options?.kakaoShareUrl ??
              current?.kakaoShareUrl ??
              (inviteCode ? `https://mo-ge.site/join?code=${inviteCode}` : ''),
          },
        };
      });
    },
    [],
  );

  const applyGroups = useCallback((serverGroups: HomeGroup[], hiddenIds: Set<number>) => {
    const nextHiddenIds = reconcileHiddenGroupIds(serverGroups, hiddenIds);
    const nextGroups = visibleGroups(serverGroups, nextHiddenIds);
    if (nextHiddenIds.size !== hiddenIds.size) writeDeletedGroupIds(nextHiddenIds);
    setDeletedGroupIds(nextHiddenIds);
    setGroups(nextGroups);
    setSelectedGroupId((current) =>
      current !== null && nextGroups.some((group) => group.id === current) ? current : null,
    );
    return nextGroups;
  }, []);

  const loadGroups = useCallback(async () => {
    const fetched = await fetchGroups();
    return applyGroups(fetched, deletedGroupIds);
  }, [applyGroups, deletedGroupIds]);

  useEffect(() => {
    let ignore = false;
    fetchGroups()
      .then((fetched) => {
        if (!ignore) applyGroups(fetched, readDeletedGroupIds());
      })
      .catch((error: unknown) => {
        if (ignore) return;
        showToast(error instanceof ApiError ? error.message : '그룹 목록을 불러오지 못했어요');
        setGroups([]);
        setSelectedGroupId(null);
        setGroupMetaById({});
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [applyGroups, showToast]);

  const runMutation = useCallback(async <T,>(request: () => Promise<T>) => {
    setIsMutating(true);
    try {
      return await request();
    } finally {
      setIsMutating(false);
    }
  }, []);

  const create = (name: string) =>
    runMutation(async () => {
      const created = await createGroup({ groupName: name });
      await loadGroups();
      setSelectedGroupId(created.groupId);
      upsertGroupMeta(created.groupId, 'LEADER', created);
      return created;
    });

  const join = (inviteCode: string) =>
    runMutation(async () => {
      const joined = await joinGroup({ inviteCode });
      await loadGroups();
      setSelectedGroupId(joined.groupId);
      upsertGroupMeta(joined.groupId, joined.role);
      return joined;
    });

  const edit = (name: string) =>
    runMutation(async () => {
      if (selectedGroupId === null) return;
      await updateGroup(selectedGroupId, { groupName: name });
      await loadGroups();
    });

  const remove = () =>
    runMutation(async () => {
      if (selectedGroupId === null) return;
      const deletedId = selectedGroupId;
      await deleteGroup(deletedId);
      const hiddenIds = new Set(deletedGroupIds).add(deletedId);
      writeDeletedGroupIds(hiddenIds);
      setDeletedGroupIds(hiddenIds);
      setGroups((current) => current.filter((group) => group.id !== deletedId));
      setSelectedGroupId(null);
      setGroupMetaById((current) => {
        const next = { ...current };
        delete next[deletedId];
        return next;
      });
      try {
        applyGroups(await fetchGroups(), hiddenIds);
      } catch {
        // keep optimistic deletion
      }
    });

  const leave = () =>
    runMutation(async () => {
      if (selectedGroupId === null) return null;
      const leftId = selectedGroupId;
      const response = await leaveGroup(leftId);
      await loadGroups();
      setGroupMetaById((current) => {
        const next = { ...current };
        delete next[leftId];
        return next;
      });
      return response;
    });

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;
  const selectedMeta = selectedGroupId === null ? undefined : groupMetaById[selectedGroupId];

  return {
    groups,
    selectedGroupId,
    selectedGroup,
    selectedGroupRole: selectedMeta?.role ?? null,
    selectedInviteCode: selectedMeta?.inviteCode ?? null,
    selectedKakaoShareUrl: selectedMeta?.kakaoShareUrl ?? null,
    isLoading,
    isMutating,
    selectGroup: (groupId: number) =>
      setSelectedGroupId((current) => (current === groupId ? null : groupId)),
    upsertGroupMeta,
    create,
    join,
    edit,
    remove,
    leave,
    reload: loadGroups,
  };
}
