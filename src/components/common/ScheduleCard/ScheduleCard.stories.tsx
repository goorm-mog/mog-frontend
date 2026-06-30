import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClipboardList } from 'lucide-react';
import ScheduleCard from './ScheduleCard';

const meta = {
  component: ScheduleCard,
  argTypes: {
    title: { control: 'text' },
    location: { control: 'text' },
    startTime: { control: 'text' },
    endTime: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    title: 'A컷 촬영 모임',
    location: 'Studio A',
    startTime: '10:00',
    endTime: '11:30',
    icon: ClipboardList,
    size: 'md',
  },
} satisfies Meta<typeof ScheduleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-[356px] flex-col gap-3">
      <ScheduleCard
        size="sm"
        title="A컷 촬영 모임"
        location="Studio A"
        startTime="10:00"
        endTime="11:30"
        icon={ClipboardList}
      />
      <ScheduleCard
        size="md"
        title="A컷 촬영 모임"
        location="Studio A"
        startTime="10:00"
        endTime="11:30"
        icon={ClipboardList}
      />
      <ScheduleCard
        size="lg"
        title="A컷 촬영 모임"
        location="Studio A"
        startTime="10:00"
        endTime="11:30"
        icon={ClipboardList}
      />
    </div>
  ),
};
