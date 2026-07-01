import type { Meta, StoryObj } from '@storybook/react-vite';
import Toast from './Toast';

const meta = {
  component: Toast,
  args: { type: 'error', message: '알림 메시지입니다.' },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    type: 'error',
    message: '요청한 리소스를 찾을 수 없습니다.',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    message: '일정이 확정되었습니다.',
  },
};

export const Info: Story = {
  args: {
    type: 'info',
    message: '날짜를 선택해주세요.',
  },
};

export const AllTypes: Story = {
  args: { type: 'error' },
  render: () => (
    <div className="flex flex-col gap-3">
      <Toast type="error" message="요청한 리소스를 찾을 수 없습니다." />
      <Toast type="success" message="일정이 확정되었습니다." />
      <Toast type="info" message="날짜를 선택해주세요." />
    </div>
  ),
};
