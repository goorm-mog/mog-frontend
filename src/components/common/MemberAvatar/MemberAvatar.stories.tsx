import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import MemberAvatar from './MemberAvatar';

const meta = {
  component: MemberAvatar,
  argTypes: {
    name: {
      control: 'text',
      description: '아바타 하단에 표시되는 멤버 이름',
    },
    selected: {
      control: 'boolean',
      description: '선택 상태 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태 여부',
    },
    tone: {
      control: 'radio',
      options: ['default', 'point', 'muted'],
      description: '아바타 테두리와 텍스트 색상',
    },
  },
  args: {
    name: '김모임',
    selected: false,
    disabled: false,
  },
} satisfies Meta<typeof MemberAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: '김모임' });

    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute('aria-pressed', 'false');
  },
};

export const Selected: Story = {
  args: {
    selected: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: '김모임' });

    await expect(avatar).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: '김모임' });

    await expect(avatar).toBeDisabled();
  },
};

export const Muted: Story = {
  args: {
    tone: 'muted',
    name: '대기중',
  },
};

export const States: Story = {
  render: () => (
    <div className="flex gap-4">
      <MemberAvatar name="기본" />
      <MemberAvatar name="선택" selected />
      <MemberAvatar name="비활성" disabled />
      <MemberAvatar name="강조" tone="point" />
      <MemberAvatar name="대기" tone="muted" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selectedAvatar = canvas.getByRole('button', { name: '선택' });
    const disabledAvatar = canvas.getByRole('button', { name: '비활성' });

    await expect(selectedAvatar).toHaveAttribute('aria-pressed', 'true');
    await expect(disabledAvatar).toBeDisabled();
  },
};

export const Clickable: Story = {
  args: {
    name: '클릭',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: '클릭' });

    await userEvent.click(avatar);
    await expect(avatar).toHaveFocus();
  },
};
