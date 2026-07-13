import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clock } from 'lucide-react';
import BottomSheet from './BottomSheet';
import SelectionCard from '@/components/common/SelectionCard/SelectionCard';

const meta = {
  component: BottomSheet,
  parameters: { layout: 'fullscreen' },
  args: {
    ctaLabel: '일정 확정하기',
    onCtaClick: () => {},
    children: null,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleCards = () => (
  <>
    <SelectionCard icon={Clock} title="7월 1일 (화) 오후 7:00" subtitle="4명 가능" isSelected>
      <span className="font-pretendard text-[13px] text-dark-border">
        김구름, 이하늘, 박바다, 최유정
      </span>
    </SelectionCard>
    <SelectionCard icon={Clock} title="7월 3일 (목) 오후 7:00" subtitle="4명 가능">
      <span className="font-pretendard text-[13px] text-dark-border">
        김구름, 이하늘, 박바다, 최유정
      </span>
    </SelectionCard>
    <SelectionCard icon={Clock} title="7월 1일 (화) 오전 10:00" subtitle="3명 가능">
      <span className="font-pretendard text-[13px] text-dark-border">김구름, 이하늘, 박바다</span>
    </SelectionCard>
  </>
);

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: '100vh' }}>
      <BottomSheet {...args}>
        <SampleCards />
      </BottomSheet>
    </div>
  ),
};

export const WithCaption: Story = {
  args: { caption: '가장 많이 겹치는 시간이 자동 선택돼요' },
  render: (args) => (
    <div style={{ minHeight: '100vh' }}>
      <BottomSheet {...args}>
        <SampleCards />
      </BottomSheet>
    </div>
  ),
};

export const CtaDisabled: Story = {
  args: {
    ctaLabel: '투표가 완료되었습니다',
    ctaDisabled: true,
    caption: '방장이 일정을 확정해야 출발지를 입력할 수 있어요',
  },
  render: (args) => (
    <div style={{ minHeight: '100vh' }}>
      <BottomSheet {...args}>
        <SampleCards />
      </BottomSheet>
    </div>
  ),
};
