import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import AddMemberAvatar from './AddMemberAvatar';
import MemberAvatar from './MemberAvatar';

const meta = {
  component: MemberAvatar,
  argTypes: {
    name: {
      control: 'text',
      description: '아바타 하단에 표시되는 멤버 이름',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '아바타 크기. 숫자를 전달하면 px 단위로 적용됩니다.',
    },
    borderWeight: {
      control: 'radio',
      options: ['thin', 'bold'],
      description: '아바타 테두리 두께',
    },
    borderStyle: {
      control: 'radio',
      options: ['solid', 'dashed'],
      description: '아바타 테두리 스타일. 비워두면 선택 상태에 따라 자동 적용됩니다.',
    },
    selected: {
      control: 'boolean',
      description: '선택 상태 여부',
    },
    showCheck: {
      control: 'boolean',
      description: '선택 상태일 때 체크 배지 표시 여부',
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
    labelTone: {
      control: 'radio',
      options: ['default', 'point', 'muted'],
      description: '라벨 색상. 비워두면 아바타 색상을 따라갑니다.',
    },
  },
  args: {
    name: '김모임',
    size: 'md',
    borderWeight: 'thin',
    selected: false,
    showCheck: true,
    disabled: false,
    tone: 'default',
  },
} satisfies Meta<typeof MemberAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

function StateItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[124px] place-items-center gap-3 rounded-md border border-[#e9e3d6] bg-[#fffaf3] px-4 py-3">
      <div className="text-center text-sm font-semibold text-[#5e5847]">
        {title}
      </div>
      {children}
    </div>
  );
}

export const Default: Story = {
  name: '기본 - 회색 점선',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: '김모임' });

    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute('aria-pressed', 'false');
  },
};

export const DefaultSolid: Story = {
  name: '기본 - 회색 실선',
  args: {
    borderStyle: 'solid',
    unselectedTone: 'muted',
    labelTone: 'default',
  },
};

export const DefaultSolidBold: Story = {
  name: '기본 - 회색 실선 굵게',
  args: {
    borderStyle: 'solid',
    borderWeight: 'bold',
    unselectedTone: 'muted',
    labelTone: 'default',
  },
};

export const Selected: Story = {
  name: '선택 - 체크 표시',
  args: {
    selected: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByRole('button', { name: '김모임' });

    await expect(avatar).toHaveAttribute('aria-pressed', 'true');
  },
};

export const SelectedWithoutCheck: Story = {
  name: '선택 - 검정 테두리',
  args: {
    selected: true,
    showCheck: false,
    tone: 'default',
  },
};

export const PointSelectedWithoutCheck: Story = {
  name: '선택 - 주황 테두리',
  args: {
    selected: true,
    showCheck: false,
    tone: 'point',
  },
};

export const Disabled: Story = {
  name: '비활성',
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
  name: '회색 톤',
  args: {
    unselectedTone: 'muted',
    name: '이름',
  },
};

export const Sizes: Story = {
  name: '크기 옵션',
  render: () => (
    <div className="flex items-start gap-4">
      <MemberAvatar name="작게" size="sm" />
      <MemberAvatar name="기본" size="md" selected />
      <MemberAvatar name="크게" size="lg" />
      <MemberAvatar name="64px" size={64} selected />
    </div>
  ),
};

export const BorderWeights: Story = {
  name: '테두리 두께',
  render: () => (
    <div className="flex items-start gap-4">
      <MemberAvatar name="점선" />
      <MemberAvatar name="점선굵게" borderWeight="bold" />
      <MemberAvatar
        name="실선"
        borderStyle="solid"
        unselectedTone="muted"
        labelTone="default"
      />
      <MemberAvatar
        name="실선굵게"
        borderStyle="solid"
        borderWeight="bold"
        unselectedTone="muted"
        labelTone="default"
      />
      <MemberAvatar name="선택" selected showCheck={false} />
      <MemberAvatar
        name="선택굵게"
        selected
        showCheck={false}
        borderWeight="bold"
      />
      <AddMemberAvatar />
      <AddMemberAvatar borderWeight="bold" />
    </div>
  ),
};

export const RequiredVariants: Story = {
  name: '필수 아바타 형태',
  render: () => (
    <div className="space-y-8">
      <div className="flex items-start gap-8">
        <MemberAvatar
          name="이름"
          borderStyle="solid"
          unselectedTone="muted"
          labelTone="default"
          size={56}
        />
        <MemberAvatar
          name="이름"
          borderStyle="solid"
          borderWeight="bold"
          unselectedTone="muted"
          labelTone="default"
          size={56}
        />
        <MemberAvatar
          name="이름"
          selected
          showCheck={false}
          tone="point"
          size={56}
        />
        <MemberAvatar
          name="이름"
          selected
          showCheck={false}
          tone="default"
          size={56}
        />
        <MemberAvatar
          name="이름"
          unselectedTone="muted"
          labelTone="default"
          size={56}
        />
      </div>
      <div className="flex items-start gap-8">
        <AddMemberAvatar size={56} />
        <MemberAvatar
          name="그룹"
          selected
          tone="default"
          size={72}
        />
        <MemberAvatar name="그룹" unselectedTone="muted" size={56} />
      </div>
    </div>
  ),
};

export const States: Story = {
  name: '전체 상태 모음',
  render: () => (
    <div className="grid max-w-[760px] grid-cols-3 gap-4">
      <StateItem title="기본 - 회색 점선">
        <MemberAvatar name="이름" />
      </StateItem>
      <StateItem title="기본 - 회색 실선">
        <MemberAvatar
          name="이름"
          borderStyle="solid"
          unselectedTone="muted"
          labelTone="default"
        />
      </StateItem>
      <StateItem title="기본 - 회색 실선 굵게">
        <MemberAvatar
          name="이름"
          borderStyle="solid"
          borderWeight="bold"
          unselectedTone="muted"
          labelTone="default"
        />
      </StateItem>
      <StateItem title="기본 - 회색 점선 굵게">
        <MemberAvatar name="이름" borderWeight="bold" />
      </StateItem>
      <StateItem title="선택 - 체크 표시">
        <MemberAvatar name="선택" selected />
      </StateItem>
      <StateItem title="선택 - 검정 테두리">
        <MemberAvatar name="이름" selected showCheck={false} />
      </StateItem>
      <StateItem title="선택 - 주황 테두리">
        <MemberAvatar name="이름" selected showCheck={false} tone="point" />
      </StateItem>
      <StateItem title="기본 - 라벨 검정">
        <MemberAvatar name="이름" labelTone="default" />
      </StateItem>
      <StateItem title="비활성">
        <MemberAvatar name="비활성" disabled />
      </StateItem>
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
  name: '클릭 가능 상태',
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
