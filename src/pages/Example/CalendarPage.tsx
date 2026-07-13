import { useState } from 'react';
import Calendar from '@/components/common/Calendar/Calendar';

function Section({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-2">
      <p className="font-dm-mono text-xs text-dark-border">{title}</p>
      <p className="font-dm-mono text-[10px] text-dark-border mb-2">{description}</p>
    </div>
  );
}

function CalendarPage() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  return (
    <div className="p-4 flex flex-col gap-8">
      {/* mode="single" (기본값) */}
      <div>
        <Section
          title='mode="single" (기본값)'
          description="단일 클릭만 가능. 드래그·Cmd+클릭 비활성화."
        />
        <Calendar mode="single" />
      </div>

      {/* mode="multiple" */}
      <div>
        <Section
          title='mode="multiple"'
          description="드래그로 기간 선택, Cmd/Ctrl+클릭으로 개별 날짜 복수 선택 가능."
        />
        <Calendar mode="multiple" />
      </div>

      {/* hintText */}
      <div>
        <Section
          title="hintText"
          description="하단에 안내 문구를 표시. 넘기지 않으면 해당 영역이 렌더링되지 않음."
        />
        <Calendar
          mode="multiple"
          hintText="날짜를 드래그 하면 기간으로 한 번씩 탭하면 개별로 선택돼요"
        />
      </div>

      {/* onSelectionChange */}
      <div>
        <Section
          title="onSelectionChange"
          description="날짜 선택 시 호출되는 콜백. 선택된 Date[] 배열을 전달."
        />
        <Calendar
          mode="multiple"
          hintText="드래그 하면 기간, ctrl + 클릭하면 여러 날짜가 선택돼요."
          onSelectionChange={setSelectedDates}
        />
        <p className="mt-2 font-dm-mono text-[10px] text-dark-border">
          선택된 날짜:{' '}
          {selectedDates.length === 0
            ? '없음'
            : selectedDates.map((d) => d.toLocaleDateString('ko-KR')).join(', ')}
        </p>
      </div>

      {/* className */}
      <div>
        <Section
          title="className"
          description="래퍼 div에 추가 Tailwind 클래스를 주입. 너비·여백 등 외부 레이아웃 조정에 사용."
        />
        <Calendar mode="single" className="rounded-none border border-border" />
      </div>
    </div>
  );
}

export default CalendarPage;
