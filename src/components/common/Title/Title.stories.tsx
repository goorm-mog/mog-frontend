import type { Meta, StoryObj } from '@storybook/react-vite';
import { MapPin, Clock, Info, AlertCircle } from 'lucide-react';
import Title from './Title';

const meta = {
  component: Title,
  argTypes: {
    title: { control: 'text', description: '제목 텍스트' },
    icon: { control: false, description: 'lucide 아이콘 컴포넌트' },
    iconStrokeWidth: { control: { type: 'number', min: 0.5, max: 3, step: 0.25 }, description: '타이틀 아이콘 두께' },
    subtitle: { control: false, description: '첫 번째 부제목 ({ text, icon?, iconStrokeWidth?, className? })' },
    subtitle2: { control: false, description: '두 번째 부제목' },
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: '제목' },
};

export const WithSubtitle: Story = {
  args: {
    title: '날짜 및 시간 선택',
    subtitle: { text: '날짜를 선택해주세요' },
  },
};

export const WithTwoSubtitles: Story = {
  args: {
    title: '출발지 입력',
    subtitle: { text: '정확한 주소를 입력해주세요' },
    subtitle2: { text: '도로명 주소 권장' },
  },
};

export const WithIcon: Story = {
  args: {
    title: '출발지',
    icon: MapPin,
    iconStrokeWidth: 1.5,
  },
};

export const WithIconAndSubtitles: Story = {
  args: {
    title: '출발지 입력',
    icon: MapPin,
    iconStrokeWidth: 1.5,
    subtitle: { text: '정확한 주소를 입력해주세요', icon: Info, iconStrokeWidth: 1.5 },
    subtitle2: { text: '도로명 주소 권장', icon: Clock, iconStrokeWidth: 1 },
  },
};

export const SubtitleWithCustomStyle: Story = {
  args: {
    title: '주의 사항',
    icon: AlertCircle,
    iconStrokeWidth: 1.5,
    subtitle: { text: '필수 입력 항목입니다', className: 'text-alert' },
    subtitle2: { text: '미입력 시 다음 단계로 이동할 수 없어요', icon: Info, className: 'text-alert' },
  },
};

export const ThinIcon: Story = {
  args: {
    title: '장소 확정',
    icon: MapPin,
    iconStrokeWidth: 1,
    subtitle: { text: '선택된 장소를 확인해주세요', icon: Info, iconStrokeWidth: 1 },
  },
};
