import type { GroupRole, HomeGroup } from '@/types/group';
import type { RoomInfo } from '@/types/room';

const PENDING_ROOMS_STORAGE_KEY = 'mog-pending-rooms';
const DELETED_GROUP_IDS_KEY = 'mog-deleted-group-ids';
const GROUP_ROLES_KEY = 'mog-group-roles';

export function readDeletedGroupIds() {
  try {
    const saved = sessionStorage.getItem(DELETED_GROUP_IDS_KEY);
    return saved ? new Set(JSON.parse(saved) as number[]) : new Set<number>();
  } catch {
    return new Set<number>();
  }
}

export function writeDeletedGroupIds(ids: Set<number>) {
  sessionStorage.setItem(DELETED_GROUP_IDS_KEY, JSON.stringify([...ids]));
}

export function reconcileHiddenGroupIds(serverGroups: HomeGroup[], hiddenIds: Set<number>) {
  const serverIds = new Set(serverGroups.map((group) => group.id));
  return new Set([...hiddenIds].filter((id) => serverIds.has(id)));
}

export function visibleGroups(serverGroups: HomeGroup[], hiddenIds: Set<number>) {
  return serverGroups.filter((group) => !hiddenIds.has(group.id));
}

export function readGroupRoles(): Partial<Record<number, GroupRole>> {
  try {
    const raw = sessionStorage.getItem(GROUP_ROLES_KEY);
    return raw ? (JSON.parse(raw) as Partial<Record<number, GroupRole>>) : {};
  } catch {
    return {};
  }
}

export function writeGroupRole(groupId: number, role: GroupRole) {
  try {
    const current = readGroupRoles();
    sessionStorage.setItem(GROUP_ROLES_KEY, JSON.stringify({ ...current, [groupId]: role }));
  } catch {
    // ignore unavailable storage
  }
}

export function readPendingRooms(groupId: number): RoomInfo[] {
  try {
    const raw = sessionStorage.getItem(PENDING_ROOMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, RoomInfo[]>;
    return (parsed[String(groupId)] ?? []).filter(
      (room) => Number.isInteger(room.roomId) && room.roomId > 0,
    );
  } catch {
    return [];
  }
}

export function writePendingRoom(groupId: number, room: RoomInfo) {
  try {
    const raw = sessionStorage.getItem(PENDING_ROOMS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, RoomInfo[]>) : {};
    const current = parsed[String(groupId)] ?? [];
    parsed[String(groupId)] = [room, ...current.filter((item) => item.roomId !== room.roomId)];
    sessionStorage.setItem(PENDING_ROOMS_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore unavailable storage
  }
}

export function removePendingRoom(roomId: number) {
  try {
    const raw = sessionStorage.getItem(PENDING_ROOMS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, RoomInfo[]>;
    Object.entries(parsed).forEach(([groupId, rooms]) => {
      const remaining = rooms.filter((room) => room.roomId !== roomId);
      if (remaining.length === 0) delete parsed[groupId];
      else parsed[groupId] = remaining;
    });
    sessionStorage.setItem(PENDING_ROOMS_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore unavailable storage
  }
}

export function clearResolvedPendingRooms(groupId: number, apiRooms: RoomInfo[]) {
  try {
    const raw = sessionStorage.getItem(PENDING_ROOMS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, RoomInfo[]>;
    const current = parsed[String(groupId)] ?? [];
    const resolvedIds = new Set(
      apiRooms
        .filter((room) => room.promiseDate != null || room.status !== 'VOTING')
        .map((room) => room.roomId),
    );
    const remaining = current.filter((room) => !resolvedIds.has(room.roomId));
    if (remaining.length === 0) delete parsed[String(groupId)];
    else parsed[String(groupId)] = remaining;
    sessionStorage.setItem(PENDING_ROOMS_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore unavailable storage
  }
}
