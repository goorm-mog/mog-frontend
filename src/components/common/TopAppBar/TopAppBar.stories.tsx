import type { Meta, StoryObj } from '@storybook/react-vite';
import TopAppBar from './TopAppBar';

const meta = {
  component: TopAppBar,
  argTypes: {
    title: { control: 'text' },
    showBack: { control: 'boolean' },
    hasNotificationBadge: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    title: 'MOG',
    showBack: false,
    hasNotificationBadge: true,
    size: 'md',
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TopAppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};

export const WithBack: Story = {
  args: { showBack: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <TopAppBar size="sm" hasNotificationBadge />
      <TopAppBar size="md" showBack hasNotificationBadge />
      <TopAppBar size="lg" showBack hasNotificationBadge />
    </div>
  ),
};
