import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarPlus, Home } from 'lucide-react';
import IconButton from './IconButton';

const meta = {
  component: IconButton,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: { size: 'md' },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeIcon: Story = {
  render: (args) => (
    <IconButton {...args} aria-label="홈 추가">
      <Home size={20} strokeWidth={2} />
    </IconButton>
  ),
};

export const CalendarIcon: Story = {
  render: (args) => (
    <IconButton {...args} aria-label="일정 추가">
      <CalendarPlus size={20} strokeWidth={2} />
    </IconButton>
  ),
};

export const Sizes: Story = {
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
