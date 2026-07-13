import { MapPin, Clock, Info, AlertCircle, Calendar } from 'lucide-react';
import Title from '@/components/common/Title/Title';

interface ExampleBlockProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

function ExampleBlock({ label, description, children }: ExampleBlockProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="font-dm-mono text-[11px] font-medium text-point">{label}</span>
        <span className="font-pretendard text-[11px] text-dark-border">{description}</span>
      </div>
      <div className="bg-dark-background/40 rounded-md px-4 py-3">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-border" />;
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-pretendard font-semibold text-[13px] text-dark-border tracking-tight">
      {children}
    </p>
  );
}

function TitlePage() {
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-head2 text-text">Title</h1>
        <p className="font-pretendard text-[12px] text-dark-border">
          제목 + 부제목 + 아이콘을 조합하는 컴포넌트
        </p>
      </div>

      <Divider />

      <GroupLabel>Props</GroupLabel>

      <ExampleBlock label="title" description="필수. 제목 텍스트.">
        <Title title="날짜 및 시간 선택" />
      </ExampleBlock>

      <ExampleBlock label="subtitle" description="선택. 첫 번째 부제목.">
        <Title title="날짜 및 시간 선택" subtitle={{ text: '날짜를 선택해주세요' }} />
      </ExampleBlock>

      <ExampleBlock label="subtitle2" description="선택. 두 번째 부제목.">
        <Title
          title="출발지 입력"
          subtitle={{ text: '정확한 주소를 입력해주세요' }}
          subtitle2={{ text: '도로명 주소 권장' }}
        />
      </ExampleBlock>

      <ExampleBlock
        label="icon + iconStrokeWidth"
        description="lucide 아이콘. strokeWidth로 두께 조절 (위부터 2 / 1.5 / 1)."
      >
        <div className="flex flex-col gap-3">
          {([2, 1.5, 1] as const).map((w) => (
            <div key={w} className="flex items-center justify-between">
              <Title title="출발지" icon={MapPin} iconStrokeWidth={w} />
              <span className="font-dm-mono text-[10px] text-dark-border">{w}</span>
            </div>
          ))}
        </div>
      </ExampleBlock>

      <ExampleBlock
        label="subtitle.icon + subtitle.iconStrokeWidth"
        description="부제목에도 아이콘과 두께 설정 가능."
      >
        <Title
          title="출발지 입력"
          icon={MapPin}
          iconStrokeWidth={1.5}
          subtitle={{ text: '정확한 주소를 입력해주세요', icon: Info, iconStrokeWidth: 1.5 }}
          subtitle2={{ text: '도로명 주소 권장', icon: Clock, iconStrokeWidth: 1 }}
        />
      </ExampleBlock>

      <ExampleBlock label="subtitle.className" description="부제목에 커스텀 Tailwind 클래스 주입.">
        <Title
          title="주의 사항"
          icon={AlertCircle}
          iconStrokeWidth={1.5}
          subtitle={{ text: '필수 입력 항목입니다', className: 'text-alert' }}
          subtitle2={{
            text: '미입력 시 다음 단계로 이동할 수 없어요',
            icon: Info,
            iconStrokeWidth: 1.5,
            className: 'text-alert',
          }}
        />
      </ExampleBlock>

      <Divider />

      <GroupLabel>실사용 예시</GroupLabel>

      <ExampleBlock label="약속 제목" description="약속 히스토리 부분">
        <Title
          title="약속 제목"
          subtitle={{
            text: 'yyyy. mm. dd (요일)  hh:mm am/pm',
            className: 'text-[11px]',
          }}
        />
      </ExampleBlock>

      <ExampleBlock label="브랜드 촬영 A컷" description="메인 홈 - 리스트 부분">
        <Title
          title="브랜드 촬영 A컷"
          subtitle={{
            text: '2025.05.24 (토) 10:00 - 14:00',
            icon: Calendar,
            iconStrokeWidth: 2.5,
            className: 'font-dm-mono text-[11px] font-regular',
          }}
          subtitle2={{
            text: 'MOG Room A',
            icon: MapPin,
            iconStrokeWidth: 2.5,
            className: 'font-dm-mono text-[11px] font-regular',
          }}
        />
      </ExampleBlock>
    </div>
  );
}

export default TitlePage;
