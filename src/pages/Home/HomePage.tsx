import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/api/auth';
import { createGroup, deleteGroup, fetchGroupDetail, fetchGroups, updateGroup } from '@/api/group';
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
import HomeSidebar from '@/pages/Home/components/HomeSidebar';
import NotificationListSheet from '@/pages/Home/components/NotificationListSheet';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/useToast';
import type { GroupRole, HomeGroup } from '@/types/group';
import {
  HOME_ARCHIVAL_ITEMS,
  HOME_DEFAULT_SELECTED,
  HOME_INITIAL_MONTH,
  HOME_MARKED_DATES,
  HOME_SCHEDULES,
  type HomeTab,
} from '@/pages/Home/constants/homeMockData';

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

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');

  const schedulesForSelectedDate = useMemo(
    () => HOME_SCHEDULES.filter((schedule) => schedule.date === selectedDateKey),
    [selectedDateKey],
  );

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

  const loadGroups = useCallback(async () => {
    const nextGroups = await fetchGroups();
    setGroups(nextGroups);
    setSelectedGroupId((current) => {
      if (current !== null && nextGroups.some((group) => group.id === current)) {
        return current;
      }
      return nextGroups[0]?.id ?? null;
    });
    return nextGroups;
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchGroups()
      .then((nextGroups) => {
        if (ignore) return;
        setGroups(nextGroups);
        setSelectedGroupId(nextGroups[0]?.id ?? null);
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
    if (selectedGroupId === null) return;

    let ignore = false;

    fetchGroupDetail(selectedGroupId)
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

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
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
      const nextGroups = await loadGroups();
      setSelectedGroupId(nextGroups[0]?.id ?? null);
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
              markedDates={HOME_MARKED_DATES}
              onSelectionChange={(dates) => {
                if (dates[0]) setSelectedDate(dates[0]);
              }}
            />
          </div>
        )}

        {activeTab === 'all' && (
          <section className="mt-9 border-t border-dashed border-border/30 pt-9">
            <div className="flex flex-col gap-3">
              {schedulesForSelectedDate.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  title={schedule.title}
                  location={schedule.location}
                  startTime={schedule.startTime}
                  endTime={schedule.endTime}
                  icon={schedule.icon}
                  locationIcon={schedule.locationIcon}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'list' && (
          <section className="flex flex-col items-center gap-6 pt-2">
            {HOME_ARCHIVAL_ITEMS.map((item) => (
              <ArchivalCard
                key={item.id}
                title={item.title}
                datetime={item.datetime}
                location={item.location}
                totalAmount={item.totalAmount}
                meta={item.meta}
              />
            ))}

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
          selectedGroupRole={selectedGroupRole}
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
          onClose={() => setIsCreateAppointmentOpen(false)}
          onSubmit={() => setIsCreateAppointmentOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default HomePage;
