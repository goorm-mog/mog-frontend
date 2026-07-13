import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/auth';
import { deleteRoom } from '@/api/room';
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
import DeleteAppointmentDialog from '@/pages/Home/components/DeleteAppointmentDialog';
import AppointmentCardMenu from '@/pages/Home/components/AppointmentCardMenu';
import LeaveGroupDialog from '@/pages/Home/components/LeaveGroupDialog';
import InviteGroupSheet from '@/pages/Home/components/InviteGroupSheet';
import JoinGroupSheet from '@/pages/Home/components/JoinGroupSheet';
import HomeSidebar from '@/pages/Home/components/HomeSidebar';
import NotificationListSheet from '@/pages/Home/components/NotificationListSheet';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/useToast';
import { HOME_INITIAL_MONTH, type HomeTab } from '@/pages/Home/constants/homeMockData';
import type { AppointmentIconId } from '@/pages/Home/constants/appointmentIcons';
import {
  loadAppointmentIconMap,
  resolveAppointmentIcon,
} from '@/pages/Home/utils/appointmentIconStorage';
import { useHomeRooms } from '@/pages/Home/hooks/useHomeRooms';
import { useHomeGroups } from '@/pages/Home/hooks/useHomeGroups';
import { useHomeOverlays } from '@/pages/Home/hooks/useHomeOverlays';
import { useCreateAppointment } from '@/pages/Home/hooks/useCreateAppointment';
import { removePendingRoom } from '@/pages/Home/utils/homeStorage';
import type { RoomInfo } from '@/types/room';
import {
  formatArchivalDatetime,
  formatCurrency,
  parsePromiseDate,
  roomDetailPath,
  roomStatusLabel,
} from '@/pages/Home/utils/homeRoomUtils';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<RoomInfo | null>(null);
  const [isDeletingAppointment, setIsDeletingAppointment] = useState(false);
  const overlays = useHomeOverlays();
  const [appointmentIcons, setAppointmentIcons] = useState<Record<number, AppointmentIconId>>(() =>
    loadAppointmentIconMap(),
  );

  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;

  const homeGroups = useHomeGroups(showToast);
  const {
    groups,
    selectedGroupId,
    selectedGroup,
    selectedGroupRole,
    selectedInviteCode,
    selectedKakaoShareUrl,
    isLoading: isGroupsLoading,
    isMutating: isGroupMutating,
    selectGroup,
    upsertGroupMeta,
  } = homeGroups;

  const {
    rooms,
    isLoading: isRoomsLoading,
    roomSummaries: activeRoomSummaries,
    refreshSelectedRooms,
    setRooms,
  } = useHomeRooms({
    groups,
    isGroupsLoading,
    selectedGroupId,
    onGroupMeta: upsertGroupMeta,
    showToast,
  });
  const { isCreating: isCreatingAppointment, createAppointment: handleCreateAppointment } =
    useCreateAppointment({
      selectedGroupId,
      refreshRooms: refreshSelectedRooms,
      setRooms,
      setIcon: (roomId, iconId) =>
        setAppointmentIcons((current) => ({ ...current, [roomId]: iconId })),
      showToast,
      onSuccess: overlays.close,
    });

  const markedDates = useMemo(
    () =>
      rooms
        .filter((room) => room.status !== 'VOTING')
        .map((room) =>
          parsePromiseDate(activeRoomSummaries[room.roomId]?.confirmedDate ?? room.promiseDate),
        )
        .filter((date): date is Date => date !== null),
    [rooms, activeRoomSummaries],
  );
  const roomsForSelectedDate = useMemo(() => {
    if (selectedDateKey === null) {
      return rooms.filter(
        (room) =>
          parsePromiseDate(activeRoomSummaries[room.roomId]?.confirmedDate ?? room.promiseDate) !==
          null,
      );
    }
    return rooms.filter((room) => {
      const date = parsePromiseDate(
        activeRoomSummaries[room.roomId]?.confirmedDate ?? room.promiseDate,
      );
      return date !== null && format(date, 'yyyy-MM-dd') === selectedDateKey;
    });
  }, [rooms, selectedDateKey, activeRoomSummaries]);
  const roomsWithoutDate = useMemo(
    () =>
      rooms.filter(
        (room) =>
          parsePromiseDate(activeRoomSummaries[room.roomId]?.confirmedDate ?? room.promiseDate) ===
          null,
      ),
    [rooms, activeRoomSummaries],
  );
  const inProgressRooms = useMemo(
    () => rooms.filter((room) => room.status !== 'COMPLETED'),
    [rooms],
  );
  const completedRooms = useMemo(
    () => rooms.filter((room) => room.status === 'COMPLETED'),
    [rooms],
  );

  const handleSelectGroup = selectGroup;

  const handleNotificationClick = () => {
    overlays.open('notifications');
    void openNotifications();
  };

  const openCreateRoomSheet = () => {
    overlays.open('createGroup');
  };

  const openJoinGroupSheet = () => {
    overlays.open('joinGroup');
  };

  const openInviteGroupSheet = () => {
    if (selectedGroupId === null || !selectedInviteCode || !selectedKakaoShareUrl) {
      showToast('초대 코드를 불러오지 못했어요');
      return;
    }
    overlays.open('inviteGroup');
  };

  const handleCreateRoom = async (name: string) => {
    try {
      await homeGroups.create(name);
      overlays.close();
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹을 만들지 못했어요';
      showToast(message);
    }
  };

  const handleJoinGroup = async (inviteCode: string) => {
    try {
      const joined = await homeGroups.join(inviteCode);
      overlays.close();
      showToast(`${joined.groupName} 그룹에 참여했어요`);
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹에 참여하지 못했어요';
      showToast(message);
    }
  };

  const handleEditRoom = async (name: string) => {
    if (selectedGroupId === null) return;

    try {
      await homeGroups.edit(name);
      overlays.close();
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹 이름을 수정하지 못했어요';
      showToast(message);
    }
  };

  const handleDeleteRoom = async () => {
    if (selectedGroupId === null) return;

    try {
      await homeGroups.remove();
      overlays.close();
      showToast('그룹을 삭제했어요');
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '그룹을 삭제하지 못했어요';
      showToast(message);
    }
  };

  const handleLeaveGroup = async () => {
    if (selectedGroupId === null) return;
    if (selectedGroupRole !== 'MEMBER') return;

    try {
      const response = await homeGroups.leave();
      overlays.close();
      showToast(response?.message || '그룹에서 탈퇴했어요');
    } catch (error: unknown) {
      const message =
        error instanceof ApiError
          ? error.code === 'LEADER_CANNOT_LEAVE' || error.status === 403
            ? '그룹장은 탈퇴할 수 없어요. 삭제를 이용해 주세요.'
            : error.message
          : '그룹에서 탈퇴하지 못했어요';
      showToast(message);
      overlays.close();
      try {
        await homeGroups.reload();
      } catch {
        // ignore
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '로그아웃에 실패했어요';
      showToast(message);
    } finally {
      overlays.close();
      navigate('/login');
    }
  };

  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete || isDeletingAppointment) return;

    setIsDeletingAppointment(true);
    try {
      await deleteRoom(appointmentToDelete.roomId);
      removePendingRoom(appointmentToDelete.roomId);
      setRooms((current) => current.filter((room) => room.roomId !== appointmentToDelete.roomId));
      setAppointmentToDelete(null);
      showToast('약속을 삭제했어요');
    } catch (error: unknown) {
      const message = error instanceof ApiError ? error.message : '약속을 삭제하지 못했어요';
      showToast(message);
    } finally {
      setIsDeletingAppointment(false);
    }
  };

  const appointmentMenu = (room: RoomInfo) => (
    <AppointmentCardMenu
      appointmentName={room.roomName}
      onDelete={() => setAppointmentToDelete(room)}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopAppBar
        hasNotificationBadge={hasUnreadNotifications}
        onNotificationClick={handleNotificationClick}
        onMenuClick={() => overlays.open('sidebar')}
      />

      <HomeTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => overlays.open('createAppointment')}
      />

      <main className="flex-1 px-4 pb-10">
        {(activeTab === 'all' || activeTab === 'calendar') && (
          <div className="mx-auto w-full max-w-[320px]">
            <Calendar
              mode="single"
              appearance="home"
              initialMonth={HOME_INITIAL_MONTH}
              allowDeselect
              markedDates={markedDates}
              onSelectionChange={(dates) => {
                setSelectedDate(dates[0] ?? null);
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
                    location={`${roomStatusLabel(room.status)}`}
                    locationIcon={ListChecks}
                    action={appointmentMenu(room)}
                    onClick={() => navigate(roomDetailPath(room, selectedGroupRole))}
                  />
                ))
              ) : selectedDate !== null ? (
                <p className="py-6 text-center text-caption text-dark-border">
                  선택한 날짜에 약속이 없어요
                </p>
              ) : roomsWithoutDate.length === 0 ? (
                <p className="py-6 text-center text-caption text-dark-border">약속이 없어요</p>
              ) : null}

              {selectedDate === null && roomsWithoutDate.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <p className="text-caption font-medium text-[#865300]">날짜 미정</p>
                  {roomsWithoutDate.map((room, index) => (
                    <ScheduleCard
                      key={room.roomId || `undated-${index}`}
                      title={room.roomName}
                      icon={resolveAppointmentIcon(room, appointmentIcons)}
                      location={`${roomStatusLabel(room.status)}`}
                      locationIcon={ListChecks}
                      action={appointmentMenu(room)}
                      onClick={() => navigate(roomDetailPath(room, selectedGroupRole))}
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
                        location={`${roomStatusLabel(room.status)}`}
                        locationIcon={ListChecks}
                        icon={resolveAppointmentIcon(room, appointmentIcons)}
                        action={appointmentMenu(room)}
                        onClick={() => navigate(roomDetailPath(room, selectedGroupRole))}
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
                      meta={[
                        { label: '단계', value: roomStatusLabel(room.status) },
                        ...(summary
                          ? [{ label: '인원', value: `${summary.totalMemberCount}명` }]
                          : []),
                      ]}
                      action={appointmentMenu(room)}
                      onClick={() => navigate(roomDetailPath(room, selectedGroupRole))}
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

      {overlays.isOpen('notifications') ? (
        <NotificationListSheet
          notifications={notifications}
          isLoading={isNotificationsLoading}
          isDeletingAll={isDeletingAll}
          onClose={overlays.close}
          onDeleteAll={() => {
            void clearAllNotifications();
          }}
        />
      ) : null}

      {overlays.isOpen('sidebar') ? (
        <HomeSidebar
          isOpen
          groups={groups}
          selectedGroupId={selectedGroupId}
          selectedGroupRole={selectedGroupRole}
          isLoading={isGroupsLoading}
          onClose={overlays.close}
          onSelectGroup={handleSelectGroup}
          onCreateGroup={openCreateRoomSheet}
          onJoinGroup={openJoinGroupSheet}
          onInviteGroup={openInviteGroupSheet}
          onEditGroup={() => {
            if (selectedGroupRole !== 'LEADER' || selectedGroupId === null) return;
            overlays.open('editGroup');
          }}
          onDeleteGroup={() => {
            if (selectedGroupRole !== 'LEADER' || selectedGroupId === null) return;
            overlays.open('deleteGroup');
          }}
          onLeaveGroup={() => {
            if (selectedGroupRole !== 'MEMBER' || selectedGroupId === null) return;
            overlays.open('leaveGroup');
          }}
          onLogout={() => {
            void handleLogout();
          }}
        />
      ) : null}

      {overlays.isOpen('createGroup') ? (
        <CreateRoomSheet
          isLoading={isGroupMutating}
          onClose={overlays.close}
          onSubmit={(name) => {
            void handleCreateRoom(name);
          }}
        />
      ) : null}

      {overlays.isOpen('joinGroup') ? (
        <JoinGroupSheet
          isLoading={isGroupMutating}
          onClose={overlays.close}
          onSubmit={(inviteCode) => {
            void handleJoinGroup(inviteCode);
          }}
        />
      ) : null}

      {overlays.isOpen('inviteGroup') &&
      selectedGroup &&
      selectedInviteCode &&
      selectedKakaoShareUrl ? (
        <InviteGroupSheet
          groupName={selectedGroup.name}
          inviteCode={selectedInviteCode}
          kakaoShareUrl={selectedKakaoShareUrl}
          onClose={overlays.close}
          onCopied={(target) =>
            showToast(target === 'code' ? '초대 코드를 복사했어요' : '공유 링크를 복사했어요')
          }
        />
      ) : null}

      {overlays.isOpen('editGroup') && selectedGroup ? (
        <CreateRoomSheet
          key={selectedGroup.id}
          mode="edit"
          initialName={selectedGroup.name}
          isLoading={isGroupMutating}
          onClose={overlays.close}
          onSubmit={(name) => {
            void handleEditRoom(name);
          }}
        />
      ) : null}

      {overlays.isOpen('deleteGroup') && selectedGroup ? (
        <DeleteGroupDialog
          groupName={selectedGroup.name}
          isLoading={isGroupMutating}
          onClose={overlays.close}
          onConfirm={() => {
            void handleDeleteRoom();
          }}
        />
      ) : null}

      {overlays.isOpen('leaveGroup') && selectedGroup ? (
        <LeaveGroupDialog
          groupName={selectedGroup.name}
          isLoading={isGroupMutating}
          onClose={overlays.close}
          onConfirm={() => {
            void handleLeaveGroup();
          }}
        />
      ) : null}

      {overlays.isOpen('createAppointment') ? (
        <CreateAppointmentSheet
          isLoading={isCreatingAppointment}
          onClose={overlays.close}
          onSubmit={(values) => {
            void handleCreateAppointment(values);
          }}
        />
      ) : null}

      {appointmentToDelete ? (
        <DeleteAppointmentDialog
          appointmentName={appointmentToDelete.roomName}
          isLoading={isDeletingAppointment}
          onClose={() => setAppointmentToDelete(null)}
          onConfirm={() => {
            void handleDeleteAppointment();
          }}
        />
      ) : null}
    </div>
  );
}

export default HomePage;
