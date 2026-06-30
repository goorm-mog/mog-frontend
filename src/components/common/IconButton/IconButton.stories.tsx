import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarPlus, Home } from 'lucide-react';
import IconButton from './IconButton';

const meta = {
  component: IconButton,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    size: 'md',
    'aria-label': '아이콘 버튼',
    children: <Home size={20} strokeWidth={2} />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeIcon: Story = {
  args: {
    'aria-label': '홈 추가',
    children: <Home size={20} strokeWidth={2} />,
  },
};

export const CalendarIcon: Story = {
  args: {
    'aria-label': '일정 추가',
    children: <CalendarPlus size={20} strokeWidth={2} />,
  },
};

export const Sizes: Story = {
  args: {
    children: <Home size={20} />,
  },
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton size="sm" aria-label="sm">
        <Home size={16} />
      </IconButton>
      <IconButton size="md" aria-label="md">
        <Home size={20} />
      </IconButton>
      <IconButton size="lg" aria-label="lg">
        <Home size={24} />
      </IconButton>
    </div>
  ),
};
