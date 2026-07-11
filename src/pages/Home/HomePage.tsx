import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/auth';
import { createGroup, deleteGroup, fetchGroupDetail, fetchGroups, joinGroup, leaveGroup, updateGroup } from '@/api/group';
import { createRoom, fetchGroupRooms, fetchRoomSummary } from '@/api/room';
import { ApiError } from '@/lib/apiFetch';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import Calendar from '@/components/common/Calendar/Calendar';
import ScheduleCard from '@/components/common/ScheduleCard/ScheduleCard';
import ArchivalCard from '@/components/common/ArchivalCard/ArchivalCard';
import DividerWithStar from '@/components/common/DividerWithStar';
import HomeTabNav from '@/pages/Home/components/HomeTabNav';
import CreateAppointmentSheet from '@/pages/Home/components/CreateAppointmentSheet';
import CreateRoomSheet from '@/pages/Home/components/CreateRoomSheet';
import DeleteGroupDialog from '@/pages/Home/components/DeleteGroupDialog';
import LeaveGroupDialog from '@/pages/Home/components/LeaveGroupDialog';
import InviteGroupSheet from '@/pages/Home/components/InviteGroupSheet';
import JoinGroupSheet from '@/pages/Home/components/JoinGroupSheet';
import type { CreateAppointmentFormValues } from '@/pages/Home/components/CreateAppointmentSheet';
import HomeSidebar from '@/pages/Home/components/HomeSidebar';
import NotificationListSheet from '@/pages/Home/components/NotificationListSheet';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/useToast';
import type { GroupDetail, GroupRole, HomeGroup } from '@/types/group';
import type { RoomInfo, RoomSummary } from '@/types/room';
import {
  HOME_DEFAULT_SELECTED,
  HOME_INITIAL_MONTH,
  type HomeTab,
} from '@/pages/Home/constants/homeMockData';
import type { AppointmentIconId } from '@/pages/Home/constants/appointmentIcons';
import {
  loadAppointmentIconMap,
  resolveAppointmentIcon,
  saveAppointmentIcon,
} from '@/pages/Home/utils/appointmentIconStorage';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const SELECTED_GROUP_STORAGE_KEY = 'mog-selected-group-id';
const PENDING_ROOMS_STORAGE_KEY = 'mog-pending-rooms';
// 백엔드 수정 전 우회 코드: GET /groups가 soft-deleted 그룹을 내려주는 동안 프론트에서 숨김
const DELETED_GROUP_IDS_KEY = 'mog-deleted-group-ids';

function readDeletedGroupIds() {
  try {
    const saved = sessionStorage.getItem(DELETED_GROUP_IDS_KEY);
    if (!saved) return new Set<number>();
    const parsed = JSON.parse(saved) as number[];
    return new Set(parsed);
  } catch {
    return new Set<number>();
  }
}

function writeDeletedGroupIds(ids: Set<number>) {
  sessionStorage.setItem(DELETED_GROUP_IDS_KEY, JSON.stringify([...ids]));
}

// 백엔드 수정 전 우회 코드: 서버에 다시 안 오면 숨김 목록에서도 제거
function reconcileHiddenGroupIds(serverGroups: HomeGroup[], hiddenIds: Set<number>) {
  const serverIds = new Set(serverGroups.map((group) => group.id));
  return new Set([...hiddenIds].filter((id) => serverIds.has(id)));
}

function visibleGroups(serverGroups: HomeGroup[], hiddenIds: Set<number>) {
  return serverGroups.filter((group) => !hiddenIds.has(group.id));
}

function readSelectedGroupId(): number | null {
  const raw = sessionStorage.getItem(SELECTED_GROUP_STORAGE_KEY);
  if (!raw) return null;
  const groupId = Number(raw);
  return Number.isInteger(groupId) && groupId > 0 ? groupId : null;
}

function writeSelectedGroupId(groupId: number | null) {
  if (groupId === null) {
    sessionStorage.removeItem(SELECTED_GROUP_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(SELECTED_GROUP_STORAGE_KEY, String(groupId));
}

function readPendingRooms(groupId: number): RoomInfo[] {
  try {
    const raw = sessionStorage.getItem(PENDING_ROOMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, RoomInfo[]>;
    const rooms = parsed[String(groupId)] ?? [];
    return rooms.filter((room) => Number.isInteger(room.roomId) && room.roomId > 0);
  } catch {
    return [];
  }
}

function writePendingRoom(groupId: number, room: RoomInfo) {
  try {
    const raw = sessionStorage.getItem(PENDING_ROOMS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, RoomInfo[]>) : {};
    const current = parsed[String(groupId)] ?? [];
    parsed[String(groupId)] = [room, ...current.filter((item) => item.roomId !== room.roomId)];
    sessionStorage.setItem(PENDING_ROOMS_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
  }
}

function clearPendingRoomsInApi(groupId: number, apiRooms: RoomInfo[]) {
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
  }
}

function mergeRooms(...lists: RoomInfo[][]): RoomInfo[] {
  const byId = new Map<number, RoomInfo>();
  for (const list of lists) {
    for (const room of list) {
      if (!byId.has(room.roomId)) byId.set(room.roomId, room);
    }
  }
  return [...byId.values()];
}

function toRoomInfoFromDetail(
  room: GroupDetail['rooms'][number],
): RoomInfo | null {
  const roomId = Number(room.roomId);
  if (!Number.isInteger(roomId) || roomId <= 0) return null;
  return {
    roomId,
    roomName: room.roomName ?? '',
    status: room.status ?? 'VOTING',
    promiseDate: room.promiseDate ?? null,
  };
}

function parsePromiseDate(promiseDate: string | null): Date | null {
  if (!promiseDate) return null;
  const date = new Date(promiseDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatArchivalDatetime(confirmedDate: string | null): string {
  const date = confirmedDate ? parsePromiseDate(confirmedDate) : null;
  if (!date) return '날짜 미정';
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${format(date, 'yyyy.MM.dd')} (${weekday}) ${format(date, 'HH:mm')}`;
}

function formatCurrency(amount: number | null | undefined): string {
  return `₩${(amount ?? 0).toLocaleString('ko-KR')}`;
}

function roomStatusLabel(status: RoomInfo['status']): string {
  if (status === 'VOTING') return '일정 조율 중';
  if (status === 'RECORDING') return '모임 기록 중';
  return '완료';
}

function roomDetailPath(room: RoomInfo): string {
  if (room.status === 'VOTING') return `/reschedule/host/${room.roomId}`;
  return `/${room.roomId}/meet-detail`;
}

function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    notifications,
    hasUnreadNotifications,
    isLoading: isNotificationsLoading,
    isDeletingAll,
    openNotifications,
    clearAllNotifications,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<HomeTab>('all');
  const [selectedDate, setSelectedDate] = useState(HOME_DEFAULT_SELECTED);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isJoinGroupOpen, setIsJoinGroupOpen] = useState(false);
  const [isInviteGroupOpen, setIsInviteGroupOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [groups, setGroups] = useState<HomeGroup[]>([]);
  const [deletedGroupIds, setDeletedGroupIds] = useState<Set<number>>(readDeletedGroupIds);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(() => readSelectedGroupId());
  const [groupMetaById, setGroupMetaById] = useState<
    Record<number, { role: GroupRole; inviteCode: string; kakaoShareUrl: string }>
  >({});
  const [isGroupsLoading, setIsGroupsLoading] = useState(true);
  const [isGroupMutating, setIsGroupMutating] = useState(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [rooms, setRooms] = useState<RoomInfo[]>(() => {
    const groupId = readSelectedGroupId();
    return groupId !== null ? readPendingRooms(groupId) : [];
  });
  const [roomsGroupId, setRoomsGroupId] = useState<number | null>(() => readSelectedGroupId());
  const [roomSummaries, setRoomSummaries] = useState<Record<number, RoomSummary>>({});
  const [summariesGroupId, setSummariesGroupId] = useState<number | null>(null);
  const [appointmentIcons, setAppointmentIcons] = useState<Record<number, AppointmentIconId>>(
    () => loadAppointmentIconMap(),
  );

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');

  const activeRooms = useMemo(
    () => (selectedGroupId !== null && roomsGroupId === selectedGroupId ? rooms : []),
    [selectedGroupId, roomsGroupId, rooms],
  );

  const isRoomsLoading = selectedGroupId !== null && roomsGroupId !== selectedGroupId;

  const markedDates = useMemo(
    () =>
      activeRooms
        .map((room) => parsePromiseDate(room.promiseDate))
        .filter((date): date is Date => date !== null),
    [activeRooms],
  );

  const roomsForSelectedDate = useMemo(
    () =>
      activeRooms.filter((room) => {
        const date = parsePromiseDate(room.promiseDate);
        return date !== null && format(date, 'yyyy-MM-dd') === selectedDateKey;
      }),
    [activeRooms, selectedDateKey],
  );

  const roomsWithoutDate = useMemo(
    () => activeRooms.filter((room) => parsePromiseDate(room.promiseDate) === null),
    [activeRooms],
  );

  const inProgressRooms = useMemo(
    () => activeRooms.filter((room) => room.status !== 'COMPLETED'),
    [activeRooms],
  );

  const completedRooms = useMemo(
    () => activeRooms.filter((room) => room.status === 'COMPLETED'),
    [activeRooms],
  );

  const activeRoomSummaries = useMemo(
    () =>
      selectedGroupId !== null &&
      summariesGroupId === selectedGroupId &&
      completedRooms.length > 0
        ? roomSummaries
        : {},
    [selectedGroupId, summariesGroupId, completedRooms, roomSummaries],
  );

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;
  const selectedGroupMeta = selectedGroupId !== null ? groupMetaById[selectedGroupId] : undefined;
  const selectedGroupRole = selectedGroupMeta?.role ?? null;
  const selectedInviteCode = selectedGroupMeta?.inviteCode ?? null;
  const selectedKakaoShareUrl = selectedGroupMeta?.kakaoShareUrl ?? null;

  const upsertGroupMeta = useCallback(
    (
      groupId: number,
      role: GroupRole,
      options?: { inviteCode?: string; kakaoShareUrl?: string },
    ) => {
      setGroupMetaById((prev) => {
        const current = prev[groupId];
        const inviteCode = options?.inviteCode ?? current?.inviteCode ?? '';
        const kakaoShareUrl =
          options?.kakaoShareUrl ??
          current?.kakaoShareUrl ??
          (inviteCode ? `https://mo-ge.site/join?code=${inviteCode}` : '');

        return {
          ...prev,
          [groupId]: {
            role,
            inviteCode,
            kakaoShareUrl,
          },
        };
      });
    },
    [],
  );

  const applyGroups = useCallback((serverGroups: HomeGroup[], hiddenIds: Set<number>) => {
    // 백엔드 수정 전 우회 코드: soft-deleted 그룹 필터
    const nextHiddenIds = reconcileHiddenGroupIds(serverGroups, hiddenIds);
    const nextGroups = visibleGroups(serverGroups, nextHiddenIds);

    if (nextHiddenIds.size !== hiddenIds.size) {
      writeDeletedGroupIds(nextHiddenIds);
    }

    setDeletedGroupIds(nextHiddenIds);
    setGroups(nextGroups);
    setSelectedGroupId((current) => {
      const preferred = current ?? readSelectedGroupId();
      if (preferred !== null && nextGroups.some((group) => group.id === preferred)) {
        writeSelectedGroupId(preferred);
        return preferred;
      }
      const fallback = nextGroups[0]?.id ?? null;
      writeSelectedGroupId(fallback);
      return fallback;
    });

    return { nextGroups, nextHiddenIds };
  }, []);

  const loadGroups = useCallback(async () => {
    const fetched = await fetchGroups();
    return applyGroups(fetched, deletedGroupIds);
  }, [applyGroups, deletedGroupIds]);

  const loadRooms = useCallback(async (groupId: number) => {
    const [listedRooms, detail] = await Promise.all([
      fetchGroupRooms(groupId),
      fetchGroupDetail(groupId).catch(() => null),
    ]);

    const detailRooms =
      detail?.rooms
        ?.map(toRoomInfoFromDetail)
        .filter((room): room is RoomInfo => room !== null) ?? [];

    const pendingRooms = readPendingRooms(groupId);
    const nextRooms = mergeRooms(listedRooms, detailRooms, pendingRooms);
    clearPendingRoomsInApi(groupId, mergeRooms(listedRooms, detailRooms));

    setRooms(nextRooms);
    setRoomsGroupId(groupId);

    if (detail) {
      upsertGroupMeta(groupId, detail.myRole, { inviteCode: detail.inviteCode });
    }

    return nextRooms;
  }, [upsertGroupMeta]);

  useEffect(() => {
    let ignore = false;

    fetchGroups()
      .then((serverGroups) => {
        if (ignore) return;
        applyGroups(serverGroups, readDeletedGroupIds());
      })
      .catch((error: unknown) => {
        if (ignore) return;
        const message = error instanceof ApiError ? error.message : '그룹 목록을 불러오지 못했어요';
        showToast(message);
        setGroups([]);
        setSelectedGroupId(null);
        writeSelectedGroupId(null);
        setGroupMetaById({});
      })
      .finally(() => {
        if (!ignore) setIsGroupsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [applyGroups, showToast]);

  useEffect(() => {
    if (selectedGroupId === null) return;

    let ignore = false;
    const groupId = selectedGroupId;
    writeSelectedGroupId(groupId);

    loadRooms(groupId).catch((error: unknown) => {
      if (ignore) return;
      const message = error instanceof ApiError ? error.message : '약속 목록을 불러오지 못했어요';
      showToast(message);
      setRooms(readPendingRooms(groupId));
      setRoomsGroupId(groupId);
    });

    return () => {
      ignore = true;
    };
  }, [selectedGroupId, loadRooms, showToast]);

  useEffect(() => {
    if (selectedGroupId === null || completedRooms.length === 0) return;

    let ignore = false;
    const groupId = selectedGroupId;

    Promise.all(
      completedRooms.map((room) =>
        fetchRoomSummary(room.roomId)
          .then((summary) => [room.roomId, summary] as const)
          .catch(() => null),
      ),
    ).then((entries) => {
      if (ignore) return;
      const next: Record<number, RoomSummary> = {};
      for (const entry of entries) {
        if (entry) next[entry[0]] = entry[1];
      }
      setRoomSummaries(next);
      setSummariesGroupId(groupId);
    });

    return () => {
      ignore = true;
    };
  }, [selectedGroupId, completedRooms]);

  const handleSelectGroup = (groupId: number) => {
    writeSelectedGroupId(groupId);
    setSelectedGroupId(groupId);
    setRooms(readPendingRooms(groupId));
    setRoomsGroupId(groupId);
    void loadRooms(groupId).catch((error: unknown) => {
      const message = error instanceof ApiError ? error.message : '약속 목록을 불러오지 못했어요';
      showToast(message);
    });
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
    void openNotifications();
  };

  const openCreateRoomSheet = () => {
    setIsSidebarOpen(false);
    setIsCreateRoomOpen(true);
  };

  const openJoinGroupSheet = () => {
    setIsSidebarOpen(false);
    setIsJoinGroupOpen(true);
  };

  const openInviteGroupSheet = () => {
    if (selectedGroupId === null || !selectedInviteCode || !selectedKakaoShareUrl) {
      showToast('초대 코드를 불러오지 못했어요');
      return;
    }
    setIsSidebarOpen(false);
    setIsInviteGroupOpen(true);
  };

  const handleCreateRoom = async (name: string) => {
    setIsGroupMutating(true);

    try {
      const created = await createGroup({ groupName: name });
      await loadGroups();
      setSelectedGroupId(created.groupId);
      upsertGroupMeta(created.groupId, 'LEADER', {
        inviteCode: created.inviteCode,
        kakaoShareUrl: created.kakaoShareUrl,
      });
      setIsCreateRoomOpen(false);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹을 만들지 못했어요';
      showToast(message);
    } finally {
      setIsGroupMutating(false);
    }
  };

  const handleJoinGroup = async (inviteCode: string) => {
    setIsGroupMutating(true);

    try {
      const joined = await joinGroup({ inviteCode });
      await loadGroups();
      setSelectedGroupId(joined.groupId);
      upsertGroupMeta(joined.groupId, joined.role);
      setIsJoinGroupOpen(false);
      showToast(`${joined.groupName} 그룹에 참여했어요`);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹에 참여하지 못했어요';
      showToast(message);
    } finally {
      setIsGroupMutating(false);
    }
  };

  const handleEditRoom = async (name: string) => {
    if (selectedGroupId === null) return;

    setIsGroupMutating(true);

    try {
      await updateGroup(selectedGroupId, { groupName: name });
      await loadGroups();
      setIsEditRoomOpen(false);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹 이름을 수정하지 못했어요';
      showToast(message);
    } finally {
      setIsGroupMutating(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (selectedGroupId === null) return;

    const deletedGroupId = selectedGroupId;
    setIsGroupMutating(true);

    try {
      await deleteGroup(deletedGroupId);

      // 백엔드 수정 전 우회 코드: soft-deleted 그룹 ID를 기억해 목록에서 숨김
      const nextHiddenIds = new Set(deletedGroupIds).add(deletedGroupId);
      writeDeletedGroupIds(nextHiddenIds);
      setDeletedGroupIds(nextHiddenIds);

      const nextGroups = groups.filter((group) => group.id !== deletedGroupId);
      setGroups(nextGroups);
      const nextSelected = nextGroups[0]?.id ?? null;
      writeSelectedGroupId(nextSelected);
      setSelectedGroupId(nextSelected);
      setGroupMetaById((prev) => {
        const next = { ...prev };
        delete next[deletedGroupId];
        return next;
      });
      setRooms([]);
      setRoomsGroupId(null);
      setRoomSummaries({});
      setSummariesGroupId(null);
      setIsDeleteRoomOpen(false);
      showToast('그룹을 삭제했어요');

      try {
        const fetched = await fetchGroups();
        applyGroups(fetched, nextHiddenIds);
      } catch {
      }
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹을 삭제하지 못했어요';
      showToast(message);
    } finally {
      setIsGroupMutating(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (selectedGroupId === null) return;
    if (selectedGroupRole !== 'MEMBER') return;

    const leftGroupId = selectedGroupId;
    setIsGroupMutating(true);

    try {
      const response = await leaveGroup(leftGroupId);

      await loadGroups();
      setGroupMetaById((prev) => {
        const next = { ...prev };
        delete next[leftGroupId];
        return next;
      });
      setRooms([]);
      setRoomsGroupId(null);
      setRoomSummaries({});
      setSummariesGroupId(null);
      setIsLeaveGroupOpen(false);
      showToast(response.message || '그룹에서 탈퇴했어요');
    } catch (error: unknown) {
      const message =
        error instanceof ApiError
          ? error.code === 'LEADER_CANNOT_LEAVE' || error.status === 403
            ? '그룹장은 탈퇴할 수 없어요. 삭제를 이용해 주세요.'
            : error.message
          : '그룹에서 탈퇴하지 못했어요';
      showToast(message);
      setIsLeaveGroupOpen(false);
      try {
        await loadGroups();
      } catch {
      }
    } finally {
      setIsGroupMutating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '로그아웃에 실패했어요';
      showToast(message);
    } finally {
      setIsSidebarOpen(false);
      navigate('/login');
    }
  };

  const handleCreateAppointment = async ({ name, iconId }: CreateAppointmentFormValues) => {
    if (selectedGroupId === null) {
      showToast('약속을 만들 그룹을 먼저 선택해 주세요');
      return;
    }

    setIsCreatingAppointment(true);

    try {
      const created = await createRoom(selectedGroupId, { roomName: name });
      const pendingRoom: RoomInfo = {
        roomId: created.roomId,
        roomName: created.roomName,
        status: created.status ?? 'VOTING',
        promiseDate: null,
      };
      writePendingRoom(selectedGroupId, pendingRoom);
      writeSelectedGroupId(selectedGroupId);
      saveAppointmentIcon({
        roomId: created.roomId,
        roomName: name,
        iconId,
      });
      setAppointmentIcons((prev) => ({ ...prev, [created.roomId]: iconId }));

      const nextRooms = await loadRooms(selectedGroupId);
      if (!nextRooms.some((room) => room.roomId === created.roomId)) {
        setRooms(mergeRooms([pendingRoom], nextRooms));
        setRoomsGroupId(selectedGroupId);
      }

      setIsCreateAppointmentOpen(false);
      navigate(`/reschedule/host/${created.roomId}`);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '약속을 만들지 못했어요';
      showToast(message);
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopAppBar
        hasNotificationBadge={hasUnreadNotifications}
        onNotificationClick={handleNotificationClick}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <HomeTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsCreateAppointmentOpen(true)}
      />

      <main className="flex-1 px-4 pb-10">
        {(activeTab === 'all' || activeTab === 'calendar') && (
          <div className="mx-auto w-full max-w-[320px]">
            <Calendar
              mode="single"
              appearance="home"
              initialMonth={HOME_INITIAL_MONTH}
              defaultSelected={[selectedDate]}
              markedDates={markedDates}
              onSelectionChange={(dates) => {
                if (dates[0]) setSelectedDate(dates[0]);
              }}
            />
          </div>
        )}

        {activeTab === 'all' && (
          <section className="mt-9 border-t border-dashed border-border/30 pt-9">
            <div className="flex flex-col gap-3">
              {roomsForSelectedDate.length > 0 ? (
                roomsForSelectedDate.map((room, index) => (
                  <ScheduleCard
                    key={room.roomId || `selected-${index}`}
                    title={room.roomName}
                    icon={resolveAppointmentIcon(room, appointmentIcons)}
                    onClick={() => navigate(roomDetailPath(room))}
                  />
                ))
              ) : roomsWithoutDate.length === 0 ? (
                <p className="py-6 text-center text-caption text-dark-border">
                  선택한 날짜에 약속이 없어요
                </p>
              ) : null}

              {roomsWithoutDate.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <p className="text-caption font-medium text-[#865300]">날짜 미정</p>
                  {roomsWithoutDate.map((room, index) => (
                    <ScheduleCard
                      key={room.roomId || `undated-${index}`}
                      title={room.roomName}
                      icon={resolveAppointmentIcon(room, appointmentIcons)}
                      onClick={() => navigate(roomDetailPath(room))}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        )}

        {activeTab === 'list' && (
          <section className="flex flex-col items-center gap-6 pt-2">
            {isRoomsLoading ? (
              <p className="py-10 text-caption text-dark-border">불러오는 중...</p>
            ) : inProgressRooms.length > 0 || completedRooms.length > 0 ? (
              <>
                {inProgressRooms.length > 0 ? (
                  <div className="flex w-full flex-col gap-3">
                    {inProgressRooms.map((room, index) => (
                      <ScheduleCard
                        key={room.roomId || `progress-${index}`}
                        title={room.roomName}
                        location={roomStatusLabel(room.status)}
                        icon={resolveAppointmentIcon(room, appointmentIcons)}
                        onClick={() => navigate(roomDetailPath(room))}
                      />
                    ))}
                  </div>
                ) : null}

                {completedRooms.map((room, index) => {
                  const summary = activeRoomSummaries[room.roomId];
                  return (
                    <ArchivalCard
                      key={room.roomId || `completed-${index}`}
                      title={room.roomName}
                      datetime={formatArchivalDatetime(summary?.confirmedDate ?? room.promiseDate)}
                      location={summary?.confirmedPlace?.placeName ?? '장소 미정'}
                      totalAmount={formatCurrency(summary?.settlement?.totalCost)}
                      meta={summary ? [{ label: '인원', value: `${summary.totalMemberCount}명` }] : []}
                      onClick={() => navigate(roomDetailPath(room))}
                    />
                  );
                })}
              </>
            ) : (
              <p className="py-10 text-caption text-dark-border">약속이 없어요</p>
            )}

            <footer className="flex w-full flex-col items-center gap-4 py-10">
              <p className="text-center text-xs text-[#4a463f]">실시간 채팅으로 문의하세요</p>
              <DividerWithStar />
            </footer>
          </section>
        )}
      </main>

      {isNotificationOpen ? (
        <NotificationListSheet
          notifications={notifications}
          isLoading={isNotificationsLoading}
          isDeletingAll={isDeletingAll}
          onClose={() => setIsNotificationOpen(false)}
          onDeleteAll={() => {
            void clearAllNotifications();
          }}
        />
      ) : null}

      {isSidebarOpen ? (
        <HomeSidebar
          isOpen={isSidebarOpen}
          groups={groups}
          selectedGroupId={selectedGroupId}
          selectedGroupRole={selectedGroupRole}
          isLoading={isGroupsLoading}
          onClose={() => setIsSidebarOpen(false)}
          onSelectGroup={handleSelectGroup}
          onCreateGroup={openCreateRoomSheet}
          onJoinGroup={openJoinGroupSheet}
          onInviteGroup={openInviteGroupSheet}
          onEditGroup={() => {
            if (selectedGroupRole !== 'LEADER' || selectedGroupId === null) return;
            setIsEditRoomOpen(true);
          }}
          onDeleteGroup={() => {
            if (selectedGroupRole !== 'LEADER' || selectedGroupId === null) return;
            setIsDeleteRoomOpen(true);
          }}
          onLeaveGroup={() => {
            if (selectedGroupRole !== 'MEMBER' || selectedGroupId === null) return;
            setIsLeaveGroupOpen(true);
          }}
          onLogout={() => {
            void handleLogout();
          }}
        />
      ) : null}

      {isCreateRoomOpen ? (
        <CreateRoomSheet
          isLoading={isGroupMutating}
          onClose={() => setIsCreateRoomOpen(false)}
          onSubmit={(name) => {
            void handleCreateRoom(name);
          }}
        />
      ) : null}

      {isJoinGroupOpen ? (
        <JoinGroupSheet
          isLoading={isGroupMutating}
          onClose={() => setIsJoinGroupOpen(false)}
          onSubmit={(inviteCode) => {
            void handleJoinGroup(inviteCode);
          }}
        />
      ) : null}

      {isInviteGroupOpen && selectedGroup && selectedInviteCode && selectedKakaoShareUrl ? (
        <InviteGroupSheet
          groupName={selectedGroup.name}
          inviteCode={selectedInviteCode}
          kakaoShareUrl={selectedKakaoShareUrl}
          onClose={() => setIsInviteGroupOpen(false)}
          onCopied={(target) =>
            showToast(target === 'code' ? '초대 코드를 복사했어요' : '공유 링크를 복사했어요')
          }
        />
      ) : null}

      {isEditRoomOpen && selectedGroup ? (
        <CreateRoomSheet
          key={selectedGroup.id}
          mode="edit"
          initialName={selectedGroup.name}
          isLoading={isGroupMutating}
          onClose={() => setIsEditRoomOpen(false)}
          onSubmit={(name) => {
            void handleEditRoom(name);
          }}
        />
      ) : null}

      {isDeleteRoomOpen && selectedGroup ? (
        <DeleteGroupDialog
          groupName={selectedGroup.name}
          isLoading={isGroupMutating}
          onClose={() => setIsDeleteRoomOpen(false)}
          onConfirm={() => {
            void handleDeleteRoom();
          }}
        />
      ) : null}

      {isLeaveGroupOpen && selectedGroup ? (
        <LeaveGroupDialog
          groupName={selectedGroup.name}
          isLoading={isGroupMutating}
          onClose={() => setIsLeaveGroupOpen(false)}
          onConfirm={() => {
            void handleLeaveGroup();
          }}
        />
      ) : null}

      {isCreateAppointmentOpen ? (
        <CreateAppointmentSheet
          isLoading={isCreatingAppointment}
          onClose={() => setIsCreateAppointmentOpen(false)}
          onSubmit={(values) => {
            void handleCreateAppointment(values);
          }}
        />
      ) : null}
    </div>
  );
}

export default HomePage;
