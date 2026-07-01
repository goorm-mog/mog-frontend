import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import Calendar from '@/components/common/Calendar/Calendar';
import TimeTable from './TimeTable';
import Title from '../../components/common/Title/Title';
import { CalendarClock, Clock } from 'lucide-react';

function Reschedule() {
  return (
    <div className="flex flex-col gap-4 pb-9">
      <StepHeader />
      <div className="flex flex-col px-6 gap-5">
        <Title
          title="날짜 선택"
          icon={CalendarClock}
          iconStrokeWidth={2}
          subtitle={{ text: '가능하신 일정을 모두 선택해주세요' }}
        />
        <Calendar mode="multiple" />

        <Title
          title="시간 선택"
          icon={Clock}
          iconStrokeWidth={2}
          subtitle={{ text: '가능하신 시간을 모두 선택해주세요' }}
        />
        <TimeTable />
      </div>
    </div>
  );
}

export default Reschedule;
