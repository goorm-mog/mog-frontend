import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clock, MapPin } from 'lucide-react';
import SelectionCard from './SelectionCard';

const meta = {
  component: SelectionCard,
  args: {
    icon: Clock,
    title: '7월 1일 (화) 오후 7:00',
    subtitle: '4명 가능',
    children: (
      <span className="font-pretendard text-[13px] text-dark-border">
        김구름, 이하늘, 박바다, 최유정
      </span>
    ),
  },
} satisfies Meta<typeof SelectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const WithMapIcon: Story = {
  args: {
    icon: MapPin,
    title: '강남역 스타벅스',
    subtitle: '서울 강남구 강남대로 396',
    children: <span className="font-pretendard text-[13px] text-dark-border">도보 5분</span>,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SelectionCard icon={Clock} title="7월 1일 (화) 오후 7:00" subtitle="4명 가능">
        <span className="font-pretendard text-[13px] text-dark-border">
          김구름, 이하늘, 박바다, 최유정
        </span>
      </SelectionCard>
      <SelectionCard icon={Clock} title="7월 3일 (목) 오전 10:00" subtitle="3명 가능" isSelected>
        <span className="font-pretendard text-[13px] text-dark-border">김구름, 이하늘, 박바다</span>
      </SelectionCard>
    </div>
  ),
};
