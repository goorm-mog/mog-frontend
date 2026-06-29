import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import Calendar from './Calendar';

const meta = {
  component: Calendar,
  tags: ['ai-generated'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'multiple'],
      description: 'single: 단일 클릭만 / multiple: 드래그 + Cmd/Ctrl+클릭 가능',
    },
    hintText: {
      control: 'text',
      description: '하단 힌트 텍스트 (없으면 미표시)',
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태 — 헤더와 요일 행이 렌더링되는지 확인
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2025.06')).toBeVisible();
    await expect(canvas.getByText('MON')).toBeVisible();
    await expect(canvas.getByText('SUN')).toBeVisible();
  },
};

// 투표 현황 페이지 — 단일 클릭만 가능
export const SingleMode: Story = {
  args: {
    mode: 'single',
    hintText: '날짜를 탭하면 가장 많이 겹치는 시간을 확인할 수 있어요',
  },
};

// 날짜 조율 페이지 — 드래그 + Cmd/Ctrl+클릭 가능
export const MultipleMode: Story = {
  args: {
    mode: 'multiple',
    hintText: '드래그 하면 기간, ctrl + 클릭하면 여러 날짜가 선택돼요.',
  },
};

// 힌트 텍스트 없음
export const NoHintText: Story = {
  args: {
    mode: 'multiple',
  },
};

// CSS 로드 검증 — 오늘(6/29)이 text-point(#d68200) 색상으로 렌더링되는지 확인
export const CssCheck: Story = {
  play: async ({ canvas }) => {
    // MockDate로 2025-06-29 고정 → 오늘은 "29" (June), 이전달 May도 "29"가 있어 [1]
    const todaySpans = canvas.getAllByText('29');
    const todaySpan = todaySpans[todaySpans.length - 1];
    // text-point = #d68200 = rgb(214, 130, 0)
    await expect(getComputedStyle(todaySpan).color).toBe('rgb(214, 130, 0)');
  },
};
