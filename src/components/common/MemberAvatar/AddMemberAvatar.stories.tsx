import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import AddMemberAvatar from './AddMemberAvatar';

const meta = {
  component: AddMemberAvatar,
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '추가 버튼 크기. 숫자를 전달하면 px 단위로 적용됩니다.',
    },
    borderWeight: {
      control: 'radio',
      options: ['thin', 'bold'],
      description: '추가 버튼 점선 테두리 두께',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태 여부',
    },
    'aria-label': {
      control: 'text',
      description: '접근성 라벨',
    },
  },
  args: {
    size: 'md',
    borderWeight: 'thin',
    disabled: false,
    'aria-label': '멤버 추가',
  },
} satisfies Meta<typeof AddMemberAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: '기본',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: '멤버 추가' });

    await expect(button).toBeVisible();
  },
};

export const BoldBorder: Story = {
  name: '굵은 점선',
  args: {
    borderWeight: 'bold',
  },
};

export const Sizes: Story = {
  name: '크기 옵션',
  render: () => (
    <div className="flex items-center gap-4">
      <AddMemberAvatar size="sm" />
      <AddMemberAvatar size="md" />
      <AddMemberAvatar size="lg" />
      <AddMemberAvatar size={64} />
    </div>
  ),
};

export const BorderWeights: Story = {
  name: '테두리 두께',
  render: () => (
    <div className="flex items-center gap-4">
      <AddMemberAvatar />
      <AddMemberAvatar borderWeight="bold" />
    </div>
  ),
};

export const Disabled: Story = {
  name: '비활성',
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: '멤버 추가' });

    await expect(button).toBeDisabled();
  },
};

export const Clickable: Story = {
  name: '클릭 가능 상태',
  args: {
    disabled: false,
  },
};
