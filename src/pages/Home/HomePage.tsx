import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/auth';
import { createGroup, deleteGroup, fetchGroupDetail, fetchGroups, updateGroup } from '@/api/group';
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
import type { CreateAppointmentFormValues } from '@/pages/Home/components/CreateAppointmentSheet';
import HomeSidebar from '@/pages/Home/components/HomeSidebar';
import NotificationListSheet from '@/pages/Home/components/NotificationListSheet';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/useToast';
import type { GroupRole, HomeGroup } from '@/types/group';
import type { RoomInfo, RoomStatus, RoomSummary } from '@/types/room';
import {
  HOME_DEFAULT_SELECTED,
  HOME_INITIAL_MONTH,
  type HomeTab,
} from '@/pages/Home/constants/homeMockData';

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

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

const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  VOTING: '계획 중',
  RECORDING: '확정 후 기록 중',
  COMPLETED: '기록 완료',
};

function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    notifications,
    hasUnreadNotifications,
    isLoading: isNotificationsLoading,
    openNotifications,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<HomeTab>('all');
  const [selectedDate, setSelectedDate] = useState(HOME_DEFAULT_SELECTED);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [groups, setGroups] = useState<HomeGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedGroupRole, setSelectedGroupRole] = useState<GroupRole | null>(null);
  const [isGroupsLoading, setIsGroupsLoading] = useState(true);
  const [isGroupMutating, setIsGroupMutating] = useState(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [roomsByGroup, setRoomsByGroup] = useState<Record<number, RoomInfo[]>>({});
  const [roomSummaries, setRoomSummaries] = useState<Record<number, RoomSummary>>({});

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');

  const allRooms = useMemo(
    () => groups.flatMap((group) => roomsByGroup[group.id] ?? []),
    [groups, roomsByGroup],
  );

  const groupNameByRoomId = useMemo(() => {
    const next: Record<number, string> = {};
    for (const group of groups) {
      for (const room of roomsByGroup[group.id] ?? []) {
        next[room.roomId] = group.name;
      }
    }
    return next;
  }, [groups, roomsByGroup]);

  const activeRooms = useMemo(() => {
    if (selectedGroupId === null) return allRooms;
    return roomsByGroup[selectedGroupId] ?? [];
  }, [allRooms, selectedGroupId, roomsByGroup]);

  const isRoomsLoading =
    isGroupsLoading || groups.some((group) => roomsByGroup[group.id] === undefined);

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

  const summaryTargetRooms = useMemo(
    () => activeRooms.filter((room) => room.status !== 'VOTING'),
    [activeRooms],
  );

  const activeRoomSummaries = roomSummaries;

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

  const loadGroups = useCallback(async () => {
    const nextGroups = await fetchGroups();
    setGroups(nextGroups);
    setSelectedGroupId((current) => {
      if (current !== null && nextGroups.some((group) => group.id === current)) {
        return current;
      }
      return null;
    });
    return nextGroups;
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchGroups()
      .then((nextGroups) => {
        if (ignore) return;
        setGroups(nextGroups);
        setSelectedGroupId(null);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        const message = error instanceof ApiError ? error.message : '그룹 목록을 불러오지 못했어요';
        showToast(message);
        setGroups([]);
        setSelectedGroupId(null);
        setSelectedGroupRole(null);
      })
      .finally(() => {
        if (!ignore) setIsGroupsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [showToast]);

  useEffect(() => {
    if (groups.length === 0) {
      return;
    }

    let ignore = false;

    Promise.all(
      groups.map((group) =>
        fetchGroupRooms(group.id)
          .then((nextRooms) => [group.id, nextRooms] as const)
          .catch((error: unknown) => {
            const message =
              error instanceof ApiError ? error.message : '약속 목록을 불러오지 못했어요';
            showToast(message);
            return [group.id, []] as const;
          }),
      ),
    )
      .then((entries) => {
        if (ignore) return;
        setRoomsByGroup(Object.fromEntries(entries));
      });

    return () => {
      ignore = true;
    };
  }, [groups, showToast]);

  useEffect(() => {
    if (selectedGroupId === null) {
      return;
    }

    let ignore = false;
    const groupId = selectedGroupId;

    fetchGroupDetail(groupId)
      .then((detail) => {
        if (!ignore) setSelectedGroupRole(detail.myRole);
      })
      .catch(() => {
        if (!ignore) setSelectedGroupRole(null);
      });

    return () => {
      ignore = true;
    };
  }, [selectedGroupId]);

  useEffect(() => {
    if (summaryTargetRooms.length === 0) {
      return;
    }

    let ignore = false;
    Promise.all(
      summaryTargetRooms.map((room) =>
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
      setRoomSummaries((current) => ({ ...current, ...next }));
    });

    return () => {
      ignore = true;
    };
  }, [summaryTargetRooms]);

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId((current) => (current === groupId ? null : groupId));
    setSelectedGroupRole(null);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(true);
    void openNotifications();
  };

  const openCreateRoomSheet = () => {
    setIsSidebarOpen(false);
    setIsCreateRoomOpen(true);
  };

  const handleCreateRoom = async (name: string) => {
    setIsGroupMutating(true);

    try {
      const created = await createGroup({ groupName: name });
      await loadGroups();
      setSelectedGroupId(created.groupId);
      setSelectedGroupRole('LEADER');
      setIsCreateRoomOpen(false);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹을 만들지 못했어요';
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

    setIsGroupMutating(true);

    try {
      await deleteGroup(selectedGroupId);
      await loadGroups();
      setSelectedGroupId(null);
      setSelectedGroupRole(null);
      setIsDeleteRoomOpen(false);
      setIsSidebarOpen(false);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹을 삭제하지 못했어요';
      showToast(message);
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

  const handleCreateAppointment = async ({ name }: CreateAppointmentFormValues) => {
    if (selectedGroupId === null) {
      showToast('약속을 만들 그룹을 먼저 선택해 주세요');
      return;
    }

    setIsCreatingAppointment(true);

    try {
      const created = await createRoom(selectedGroupId, { roomName: name });
      setIsCreateAppointmentOpen(false);
      navigate(`/reschedule/host/${created.roomId}`);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '약속을 만들지 못했어요';
      showToast(message);
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const handleRoomClick = (room: RoomInfo) => {
    if (room.status === 'VOTING') {
      navigate(`/reschedule/host/${room.roomId}`);
      return;
    }

    if (room.status === 'RECORDING') {
      navigate(`/${room.roomId}/meet-record`);
      return;
    }

    navigate(`/${room.roomId}/meet-detail`);
  };

  const getRoomGroupName = (room: RoomInfo) => groupNameByRoomId[room.roomId] ?? '그룹 미정';

  const getScheduleCardSubtitle = (room: RoomInfo) => {
    const statusLabel = ROOM_STATUS_LABEL[room.status];
    if (selectedGroupId !== null) return statusLabel;
    return `${getRoomGroupName(room)} · ${statusLabel}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopAppBar
        showBack
        hasNotificationBadge={hasUnreadNotifications}
        onBack={() => navigate('/login')}
        onNotificationClick={handleNotificationClick}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <HomeTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => {
          if (activeTab === 'all') {
            openCreateRoomSheet();
            return;
          }

          if (activeTab === 'list') {
            setIsCreateAppointmentOpen(true);
          }
        }}
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
                roomsForSelectedDate.map((room) => (
                  <ScheduleCard
                    key={room.roomId}
                    title={room.roomName}
                    location={getScheduleCardSubtitle(room)}
                    icon={CalendarDays}
                    locationIcon={selectedGroupId === null ? UsersRound : undefined}
                    onClick={() => handleRoomClick(room)}
                  />
                ))
              ) : (
                <p className="py-6 text-center text-caption text-dark-border">
                  선택한 날짜에 약속이 없어요
                </p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'list' && (
          <section className="flex flex-col items-center gap-6 pt-2">
            {isRoomsLoading ? (
              <p className="py-10 text-caption text-dark-border">불러오는 중...</p>
            ) : activeRooms.length > 0 ? (
              activeRooms.map((room) => {
                const summary = activeRoomSummaries[room.roomId];
                return (
                  <ArchivalCard
                    key={room.roomId}
                    title={room.roomName}
                    datetime={formatArchivalDatetime(summary?.confirmedDate ?? room.promiseDate)}
                    location={summary?.confirmedPlace?.placeName ?? '장소 미정'}
                    totalAmount={formatCurrency(summary?.settlement?.totalCost)}
                    meta={[
                      ...(selectedGroupId === null
                        ? [{ label: '그룹', value: getRoomGroupName(room) }]
                        : []),
                      ...(summary ? [{ label: '인원', value: `${summary.totalMemberCount}명` }] : []),
                      { label: '상태', value: ROOM_STATUS_LABEL[room.status] },
                    ]}
                    onClick={() => handleRoomClick(room)}
                  />
                );
              })
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
          onClose={() => setIsNotificationOpen(false)}
        />
      ) : null}

      {isSidebarOpen ? (
        <HomeSidebar
          isOpen={isSidebarOpen}
          groups={groups}
          selectedGroupId={selectedGroupId}
          selectedGroupRole={selectedGroupId === null ? null : selectedGroupRole}
          isLoading={isGroupsLoading}
          onClose={() => setIsSidebarOpen(false)}
          onSelectGroup={handleSelectGroup}
          onCreateGroup={openCreateRoomSheet}
          onEditGroup={() => {
            if (selectedGroupRole !== 'LEADER' || selectedGroupId === null) return;
            setIsEditRoomOpen(true);
          }}
          onDeleteGroup={() => {
            if (selectedGroupRole !== 'LEADER' || selectedGroupId === null) return;
            setIsDeleteRoomOpen(true);
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
          onClose={() => setIsDeleteRoomOpen(false)}
          onConfirm={() => {
            void handleDeleteRoom();
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
