import type { Meta, StoryObj } from '@storybook/react-vite';
import ConfirmModal from './ConfirmModal';

const meta = {
  component: ConfirmModal,
  parameters: { layout: 'fullscreen' },
  args: {
    title: '중간지점 찾기로 이동할까요?',
    description: '이동하면 더 이상 출발지를 수정할 수 없어요.',
    confirmLabel: '이동하기',
    cancelLabel: '취소',
    onConfirm: () => {},
    onClose: () => {},
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDescription: Story = {
  args: {
    title: '정말 삭제할까요?',
    description: undefined,
    confirmLabel: '삭제하기',
  },
};

export const LongTitle: Story = {
  args: {
    title: '저장하지 않고 나가시겠어요?',
    description: '입력한 내용이 모두 사라져요.',
    confirmLabel: '나가기',
  },
};
