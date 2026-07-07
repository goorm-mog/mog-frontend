import { http, HttpResponse, type HttpHandler } from 'msw';
import type {
  GroupCreateApiResponse,
  GroupDeleteApiResponse,
  GroupDetailApiResponse,
  GroupItem,
  GroupListApiResponse,
  GroupUpdateApiResponse,
} from '@/types/group';
import { getMyUserId } from '@/lib/auth-storage';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const mutableGroups: GroupItem[] = [
  { groupId: 12, groupName: '대학 친구들', memberCount: 4 },
  { groupId: 13, groupName: '브랜드 팀', memberCount: 6 },
  { groupId: 14, groupName: '가족 모임', memberCount: 3 },
];

let nextGroupId = 15;

function buildListResponse(): GroupListApiResponse {
  return {
    status: 200,
    code: 'SUCCESS',
    message: '그룹 목록 조회 성공',
    data: {
      groups: [...mutableGroups],
    },
  };
}

export const groupHandlers: HttpHandler[] = [
  http.get(`${BASE}/api/v1/groups`, () => {
    return HttpResponse.json(buildListResponse());
  }),

  http.get(`${BASE}/api/v1/groups/:groupId`, ({ params }) => {
    const groupId = Number(params.groupId);
    const target = mutableGroups.find((group) => group.groupId === groupId);

    if (!target) {
      return HttpResponse.json({ message: '그룹을 찾을 수 없습니다.' }, { status: 404 });
    }

    const myRole = groupId === 13 ? 'MEMBER' : 'LEADER';
    const userId = getMyUserId() ?? 1;

    const response: GroupDetailApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '그룹 상세 조회 성공',
      data: {
        groupId,
        groupName: target.groupName,
        inviteCode: 'UX7A2B',
        myRole,
        members: [{ userId, nickname: '김구름', role: myRole }],
        rooms: [],
      },
    };

    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/api/v1/groups`, async ({ request }) => {
    const body = (await request.json()) as { groupName: string };
    const groupId = nextGroupId++;
    const createdAt = new Date().toISOString();

    mutableGroups.push({
      groupId,
      groupName: body.groupName,
      memberCount: 1,
    });

    const response: GroupCreateApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '그룹 생성 성공',
      data: {
        groupId,
        groupName: body.groupName,
        inviteCode: 'MOCK01',
        kakaoShareUrl: `https://mo-ge.site/join?code=MOCK01`,
        createdAt,
      },
    };

    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/api/v1/groups/:groupId`, async ({ params, request }) => {
    const groupId = Number(params.groupId);
    const body = (await request.json()) as { groupName: string };
    const target = mutableGroups.find((group) => group.groupId === groupId);

    if (!target) {
      return HttpResponse.json({ message: '그룹을 찾을 수 없습니다.' }, { status: 404 });
    }

    target.groupName = body.groupName;

    const response: GroupUpdateApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '그룹 수정 성공',
      data: {
        groupId,
        groupName: body.groupName,
        updatedAt: new Date().toISOString(),
      },
    };

    return HttpResponse.json(response);
  }),

  http.delete(`${BASE}/api/v1/groups/:groupId`, ({ params }) => {
    const groupId = Number(params.groupId);
    const index = mutableGroups.findIndex((group) => group.groupId === groupId);

    if (index === -1) {
      return HttpResponse.json({ message: '그룹을 찾을 수 없습니다.' }, { status: 404 });
    }

    mutableGroups.splice(index, 1);

    const response: GroupDeleteApiResponse = {
      status: 200,
      code: 'SUCCESS',
      message: '그룹 삭제 성공',
      data: {
        groupId,
        deletedAt: new Date().toISOString(),
      },
    };

    return HttpResponse.json(response);
  }),
];

export { mutableGroups };
