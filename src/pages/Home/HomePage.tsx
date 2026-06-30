import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import Calendar from '@/components/common/Calendar/Calendar';
import ScheduleCard from '@/components/common/ScheduleCard/ScheduleCard';
import ArchivalCard from '@/components/common/ArchivalCard/ArchivalCard';
import DividerWithStar from '@/components/common/DividerWithStar';
import HomeTabNav from '@/pages/Home/components/HomeTabNav';
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
  const [activeTab, setActiveTab] = useState<HomeTab>('all');
  const [selectedDate, setSelectedDate] = useState(HOME_DEFAULT_SELECTED);

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');

  const schedulesForSelectedDate = useMemo(
    () => HOME_SCHEDULES.filter((schedule) => schedule.date === selectedDateKey),
    [selectedDateKey],
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopAppBar
        showBack
        hasNotificationBadge
        onBack={() => navigate('/login')}
      />

      <HomeTabNav activeTab={activeTab} onTabChange={setActiveTab} />

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
    </div>
  );
}

export default HomePage;
