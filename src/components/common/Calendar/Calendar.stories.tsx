import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import Calendar from './Calendar';

// MockDate 기준: 2025-06-29
const JUNE_AVAILABLE = [
  new Date('2025-06-02'),
  new Date('2025-06-03'),
  new Date('2025-06-05'),
  new Date('2025-06-06'),
  new Date('2025-06-09'),
  new Date('2025-06-10'),
  new Date('2025-06-12'),
  new Date('2025-06-13'),
];
const JUNE_DOT = [new Date('2025-06-05'), new Date('2025-06-10'), new Date('2025-06-13')];

// 홈 화면 기준: 2026-07
const JULY_MARKED = [1, 3, 4, 6, 7, 9, 11, 12, 14, 17, 20, 23, 27, 29].map(
  (day) => new Date(2026, 6, day),
);

const meta = {
  component: Calendar,
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'multiple'],
    },
    appearance: {
      control: 'radio',
      options: ['default', 'home'],
    },
    hintText: { control: 'text' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { hintText: '' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2025.06')).toBeVisible();
    await expect(canvas.getByText('MON')).toBeVisible();
    await expect(canvas.getByText('SUN')).toBeVisible();
  },
};

// 날짜 조율 — 드래그 + Shift+드래그(추가) + Cmd/Ctrl+클릭 가능
export const MultipleMode: Story = {
  args: {
    mode: 'multiple',
    hintText: '드래그: 기간 · Shift + 드래그: 기간 추가\n클릭: 날짜 · ⌘ + 클릭: 날짜 추가',
  },
};

// 선택 가능한 날짜 제한 (투표 슬롯 날짜만 활성)
export const WithAvailableDates: Story = {
  args: {
    mode: 'multiple',
    availableDates: JUNE_AVAILABLE,
    hintText: '슬롯으로 등록된 날짜만 선택할 수 있어요',
  },
};

// dot 표시 — 투표 결과 확인 화면에서 상위 날짜 강조
export const WithDotDates: Story = {
  args: {
    mode: 'single',
    availableDates: JUNE_AVAILABLE,
    dotDates: JUNE_DOT,
    hintText: '날짜를 탭하면 투표 현황을 확인할 수 있어요',
  },
};

// 홈 화면 스타일 — 배경 없음, 작은 화살표, rounded-xl 선택
export const HomeAppearance: Story = {
  args: {
    appearance: 'home',
    initialMonth: new Date(2026, 6, 1),
    defaultSelected: [new Date(2026, 6, 1)],
  },
};

// 홈 화면 — 일정 있는 날짜에 갈색 점 표시
export const HomeWithMarkedDates: Story = {
  args: {
    appearance: 'home',
    initialMonth: new Date(2026, 6, 1),
    defaultSelected: [new Date(2026, 6, 1)],
    markedDates: JULY_MARKED,
  },
};

// CSS 검증 — 오늘(6/29)이 text-point(#d68200)로 렌더링되는지 확인
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const todaySpans = canvas.getAllByText('29');
    const todaySpan = todaySpans[todaySpans.length - 1];
    await expect(getComputedStyle(todaySpan).color).toBe('rgb(214, 130, 0)');
  },
};
