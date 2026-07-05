import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

type GroupRole = 'LEADER' | 'MEMBER';

type GroupMember = {
  userId: number;
  nickname: string;
  role: GroupRole;
};

type MutableGroup = {
  groupId: number;
  groupName: string;
  inviteCode: string;
  kakaoShareUrl: string;
  createdAt: string;
  members: GroupMember[];
};

const ok = <T>(data: T, message = '요청이 성공했습니다.'): ApiResponse<T> => ({
  status: 0,
  code: 'SUCCESS',
  message,
  data,
});

const error = (status: number, code: string, message: string) =>
  HttpResponse.json({ status, code, message, data: null }, { status });

const groups: MutableGroup[] = mockDb.groups.map((group) => ({
  ...group,
  members: group.members.map((member) => ({ ...member })),
}));

let nextGroupId = Math.max(...groups.map(({ groupId }) => groupId)) + 1;

const getCurrentUserMember = (group: MutableGroup) =>
  group.members.find(({ userId }) => userId === mockDb.auth.currentUser.userId);

const createInviteCode = (groupId: number) => `MOG${String(groupId).padStart(3, '0')}`;

export const groupHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/groups`, () => {
    const myGroups = groups
      .filter((group) => getCurrentUserMember(group))
      .map(({ groupId, groupName, members }) => ({
        groupId,
        groupName,
        memberCount: members.length,
      }));

    return HttpResponse.json(ok({ groups: myGroups }, '내 그룹 목록 조회에 성공했습니다.'));
  }),

  http.post(`${BASE}/api/v1/groups`, async ({ request }) => {
    const { groupName } = (await request.json()) as { groupName?: string };

    if (!groupName?.trim()) {
      return error(400, 'INVALID_GROUP_NAME', '그룹 이름을 입력해주세요.');
    }

    const groupId = nextGroupId++;
    const inviteCode = createInviteCode(groupId);
    const createdAt = new Date().toISOString();
    const group: MutableGroup = {
      groupId,
      groupName: groupName.trim(),
      inviteCode,
      kakaoShareUrl: `https://mo-ge.site/join?code=${inviteCode}`,
      createdAt,
      members: [
        {
          userId: mockDb.auth.currentUser.userId,
          nickname: mockDb.auth.currentUser.nickname,
          role: 'LEADER',
        },
      ],
    };

    groups.push(group);

    return HttpResponse.json(
      ok(
        {
          groupId: group.groupId,
          groupName: group.groupName,
          inviteCode: group.inviteCode,
          kakaoShareUrl: group.kakaoShareUrl,
          createdAt: group.createdAt,
        },
        '그룹 생성에 성공했습니다.',
      ),
    );
  }),

  http.post(`${BASE}/api/v1/groups/join`, async ({ request }) => {
    const { inviteCode } = (await request.json()) as { inviteCode?: string };
    const group = groups.find((item) => item.inviteCode === inviteCode?.trim());

    if (!group) {
      return error(404, 'GROUP_NOT_FOUND', '초대 코드에 해당하는 그룹이 없습니다.');
    }

    const currentMember = getCurrentUserMember(group);
    const role = currentMember?.role ?? 'MEMBER';

    if (!currentMember) {
      group.members.push({
        userId: mockDb.auth.currentUser.userId,
        nickname: mockDb.auth.currentUser.nickname,
        role,
      });
    }

    return HttpResponse.json(
      ok(
        {
          groupId: group.groupId,
          groupName: group.groupName,
          role,
        },
        '그룹 참여에 성공했습니다.',
      ),
    );
  }),

  http.get(`${BASE}/api/v1/groups/:groupId`, ({ params }) => {
    const groupId = Number(params.groupId);
    const group = groups.find((item) => item.groupId === groupId);

    if (!group) {
      return error(404, 'GROUP_NOT_FOUND', '그룹 정보를 찾을 수 없습니다.');
    }

    const currentMember = getCurrentUserMember(group);
    if (!currentMember) {
      return error(403, 'GROUP_ACCESS_DENIED', '그룹 멤버만 조회할 수 있습니다.');
    }

    const rooms = mockDb.rooms
      .filter((room) => room.groupId === groupId)
      .map(({ roomId, roomName, status, promiseDate }) => ({
        roomId,
        roomName,
        status,
        promiseDate,
      }));

    return HttpResponse.json(
      ok(
        {
          groupId: group.groupId,
          groupName: group.groupName,
          inviteCode: group.inviteCode,
          myRole: currentMember.role,
          members: group.members,
          rooms,
        },
        '그룹 상세 조회에 성공했습니다.',
      ),
    );
  }),

  http.post(`${BASE}/api/v1/groups/:groupId`, async ({ params, request }) => {
    const groupId = Number(params.groupId);
    const group = groups.find((item) => item.groupId === groupId);
    const { groupName } = (await request.json()) as { groupName?: string };

    if (!group) {
      return error(404, 'GROUP_NOT_FOUND', '그룹 정보를 찾을 수 없습니다.');
    }

    if (getCurrentUserMember(group)?.role !== 'LEADER') {
      return error(403, 'GROUP_PERMISSION_DENIED', '그룹장만 수정할 수 있습니다.');
    }

    if (!groupName?.trim()) {
      return error(400, 'INVALID_GROUP_NAME', '그룹 이름을 입력해주세요.');
    }

    group.groupName = groupName.trim();

    return HttpResponse.json(
      ok(
        {
          groupId: group.groupId,
          groupName: group.groupName,
          updatedAt: new Date().toISOString(),
        },
        '그룹 수정에 성공했습니다.',
      ),
    );
  }),

  http.delete(`${BASE}/api/v1/groups/:groupId`, ({ params }) => {
    const groupId = Number(params.groupId);
    const groupIndex = groups.findIndex((item) => item.groupId === groupId);

    if (groupIndex === -1) {
      return error(404, 'GROUP_NOT_FOUND', '그룹 정보를 찾을 수 없습니다.');
    }

    if (getCurrentUserMember(groups[groupIndex])?.role !== 'LEADER') {
      return error(403, 'GROUP_PERMISSION_DENIED', '그룹장만 삭제할 수 있습니다.');
    }

    groups.splice(groupIndex, 1);

    return HttpResponse.json(
      ok(
        {
          groupId,
          deletedAt: new Date().toISOString(),
        },
        '그룹 삭제에 성공했습니다.',
      ),
    );
  }),

  http.delete(`${BASE}/api/v1/groups/:groupId/leave`, ({ params }) => {
    const groupId = Number(params.groupId);
    const group = groups.find((item) => item.groupId === groupId);

    if (!group) {
      return error(404, 'GROUP_NOT_FOUND', '그룹 정보를 찾을 수 없습니다.');
    }

    const currentMember = getCurrentUserMember(group);
    if (!currentMember) {
      return error(403, 'GROUP_ACCESS_DENIED', '그룹 멤버만 탈퇴할 수 있습니다.');
    }

    if (currentMember.role === 'LEADER') {
      return error(403, 'GROUP_LEADER_CANNOT_LEAVE', '그룹장은 탈퇴할 수 없습니다.');
    }

    group.members = group.members.filter(({ userId }) => userId !== mockDb.auth.currentUser.userId);

    return HttpResponse.json(
      ok(
        {
          groupId,
          userId: mockDb.auth.currentUser.userId,
        },
        '그룹 탈퇴에 성공했습니다.',
      ),
    );
  }),
];
