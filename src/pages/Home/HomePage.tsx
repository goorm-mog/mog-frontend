import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
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
import {
  HOME_ARCHIVAL_ITEMS,
  HOME_DEFAULT_SELECTED,
  HOME_INITIAL_MONTH,
  HOME_MARKED_DATES,
  HOME_SCHEDULES,
  type HomeTab,
} from '@/pages/Home/constants/homeMockData';
import { HOME_GROUPS, type HomeGroup } from '@/pages/Home/constants/groupMockData';

function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HomeTab>('all');
  const [selectedDate, setSelectedDate] = useState(HOME_DEFAULT_SELECTED);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false);
  const [groups, setGroups] = useState<HomeGroup[]>(HOME_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(HOME_GROUPS[0]?.id ?? null);

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');

  const schedulesForSelectedDate = useMemo(
    () => HOME_SCHEDULES.filter((schedule) => schedule.date === selectedDateKey),
    [selectedDateKey],
  );

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;

  const openCreateRoomSheet = () => {
    setIsSidebarOpen(false);
    setIsCreateRoomOpen(true);
  };

  const handleCreateRoom = (name: string) => {
    const nextId = Math.max(0, ...groups.map((group) => group.id)) + 1;
    const newGroup: HomeGroup = { id: nextId, name, memberCount: 1 };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(nextId);
    setIsCreateRoomOpen(false);
  };

  const handleEditRoom = (name: string) => {
    if (selectedGroupId === null) return;

    setGroups((prev) =>
      prev.map((group) => (group.id === selectedGroupId ? { ...group, name } : group)),
    );
    setIsEditRoomOpen(false);
  };

  const handleDeleteRoom = () => {
    if (selectedGroupId === null) return;

    setGroups((prev) => {
      const next = prev.filter((group) => group.id !== selectedGroupId);
      setSelectedGroupId(next[0]?.id ?? null);
      return next;
    });
    setIsDeleteRoomOpen(false);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopAppBar
        showBack
        hasNotificationBadge
        onBack={() => navigate('/login')}
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

      {isSidebarOpen ? (
        <HomeSidebar
          isOpen={isSidebarOpen}
          groups={groups}
          selectedGroupId={selectedGroupId}
          onClose={() => setIsSidebarOpen(false)}
          onSelectGroup={setSelectedGroupId}
          onCreateGroup={openCreateRoomSheet}
          onEditGroup={() => {
            if (selectedGroupId === null) return;
            setIsEditRoomOpen(true);
          }}
          onDeleteGroup={() => {
            if (selectedGroupId === null) return;
            setIsDeleteRoomOpen(true);
          }}
        />
      ) : null}

      {isCreateRoomOpen ? (
        <CreateRoomSheet
          onClose={() => setIsCreateRoomOpen(false)}
          onSubmit={handleCreateRoom}
        />
      ) : null}

      {isEditRoomOpen && selectedGroup ? (
        <CreateRoomSheet
          key={selectedGroup.id}
          mode="edit"
          initialName={selectedGroup.name}
          onClose={() => setIsEditRoomOpen(false)}
          onSubmit={handleEditRoom}
        />
      ) : null}

      {isDeleteRoomOpen && selectedGroup ? (
        <DeleteGroupDialog
          groupName={selectedGroup.name}
          onClose={() => setIsDeleteRoomOpen(false)}
          onConfirm={handleDeleteRoom}
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
