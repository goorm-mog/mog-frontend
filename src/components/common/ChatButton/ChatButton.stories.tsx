import type { Meta, StoryObj } from '@storybook/react-vite';
import ChatButton from './ChatButton';

const meta = {
  component: ChatButton,
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    width: { control: 'number' },
    height: { control: 'number' },
    iconSize: { control: 'number' },
  },
  args: {
    size: 'lg',
    'aria-label': '채팅 열기',
  },
} satisfies Meta<typeof ChatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ChatButton size="sm" />
      <ChatButton size="md" />
      <ChatButton size="lg" />
      <ChatButton width={64} height={52} iconSize={24} aria-label="커스텀 크기 채팅 열기" />
    </div>
  ),
};
