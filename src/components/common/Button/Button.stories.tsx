import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

const meta = {
  component: Button,
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'radio', options: ['dark', 'point'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: '버튼',
    variant: 'dark',
    size: 'md',
    fullWidth: true,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DarkLarge: Story = {
  args: { variant: 'dark', size: 'lg' },
};

export const PointLarge: Story = {
  args: { variant: 'point', size: 'lg' },
};

export const DarkMedium: Story = {
  args: { variant: 'dark', size: 'md' },
};

export const PointMedium: Story = {
  args: { variant: 'point', size: 'md' },
};

export const DarkSmall: Story = {
  args: { variant: 'dark', size: 'sm', fullWidth: false },
};

export const PointSmall: Story = {
  args: { variant: 'point', size: 'sm', fullWidth: false },
};

export const AllSizes: Story = {
  args: {
    children: '버튼',
  },
  render: () => (
    <div className="flex w-[320px] flex-col gap-3">
      <Button size="lg">Large</Button>
      <Button size="md">Medium</Button>
      <Button size="sm" fullWidth={false}>
        Small
      </Button>
    </div>
  ),
};
