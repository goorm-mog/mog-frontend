import type { Meta, StoryObj } from '@storybook/react-vite';
import ArchivalCard from './ArchivalCard';

const meta = {
  component: ArchivalCard,
  argTypes: {
    title: { control: 'text' },
    datetime: { control: 'text' },
    location: { control: 'text' },
    totalAmount: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    title: '브랜드 촬영 A컷',
    datetime: '2025.05.24 (토) 10:00 - 14:00',
    location: 'MOG Room A',
    totalAmount: '₩350,000',
    meta: [
      { label: '예약자', value: 'MOG Studio' },
      { label: '예약 번호', value: '#250524-A1' },
    ],
    size: 'md',
  },
} satisfies Meta<typeof ArchivalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full max-w-[358px] flex-col gap-4">
      <ArchivalCard
        size="sm"
        title="브랜드 촬영 A컷"
        datetime="2025.05.24 (토) 10:00 - 14:00"
        location="MOG Room A"
        totalAmount="₩350,000"
        meta={[
          { label: '예약자', value: 'MOG Studio' },
          { label: '예약 번호', value: '#250524-A1' },
        ]}
      />
      <ArchivalCard
        size="md"
        title="브랜드 촬영 A컷"
        datetime="2025.05.24 (토) 10:00 - 14:00"
        location="MOG Room A"
        totalAmount="₩350,000"
        meta={[
          { label: '예약자', value: 'MOG Studio' },
          { label: '예약 번호', value: '#250524-A1' },
        ]}
      />
      <ArchivalCard
        size="lg"
        title="브랜드 촬영 A컷"
        datetime="2025.05.24 (토) 10:00 - 14:00"
        location="MOG Room A"
        totalAmount="₩350,000"
        meta={[
          { label: '예약자', value: 'MOG Studio' },
          { label: '예약 번호', value: '#250524-A1' },
        ]}
      />
    </div>
  ),
};
