import { http, HttpResponse, type HttpHandler } from 'msw';
import { groupsDb } from '@/mocks/db/group';
import { roomMembersDb, roomsDb, type MockRoomStatus } from '@/mocks/db/room';
import { mockDb } from '@/mocks/fixtures/mockDb';
import type {
  RoomCloseResponse,
  RoomCreateResponse,
  RoomDetailResponse,
  RoomListResponse,
  RoomStatusResponse,
  RoomStepResponse,
} from '@/types/rooms';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const ok = <T>(data: T, message: string) => ({
  status: 0,
  code: 'SUCCESS',
  message,
  data,
});

const error = (status: number, code: string, message: string) =>
  HttpResponse.json({ status, code, message, data: null }, { status });

const activeRooms = () => roomsDb.filter(({ deletedAt }) => !deletedAt);

const currentUserId = () => mockDb.auth.currentUser.userId;

const findGroup = (groupId: number) => groupsDb.find((group) => group.groupId === groupId);

const findRoom = (roomId: number) => activeRooms().find((room) => room.roomId === roomId);

const getGroupMember = (groupId: number) =>
  findGroup(groupId)?.members.find(({ userId }) => userId === currentUserId());

const getRoomMembers = (roomId: number) =>
  roomMembersDb
    .filter((member) => member.roomId === roomId)
    .map((member) => ({
      ...member,
      profileImageUrl: mockDb.users.find(({ userId }) => userId === member.userId)?.profileImageUrl ?? '',
    }));

const mapRoomRole = (role: string) => (role === 'HOST' ? 'LEADER' : 'MEMBER');

const createRoomMemberId = () =>
  Math.max(0, ...roomMembersDb.map(({ roomMemberId }) => roomMemberId)) + 1;

const createRoomId = () => Math.max(0, ...roomsDb.map(({ roomId }) => roomId)) + 1;

const ROOM_STATUSES = ['VOTING', 'RECORDING', 'COMPLETED'] as const;

const isRoomStatus = (status: unknown): status is MockRoomStatus =>
  typeof status === 'string' && ROOM_STATUSES.includes(status as MockRoomStatus);

const getCurrentStep = (status: MockRoomStatus) => ROOM_STATUSES.indexOf(status);

export const roomHandlers: HttpHandler[] = [
  http.post(`${BASE}/api/v1/groups/:groupId/rooms`, async ({ params, request }) => {
    const groupId = Number(params.groupId);
    const group = findGroup(groupId);

    if (!group) {
      return error(404, 'GROUP_NOT_FOUND', '그룹 정보를 찾을 수 없습니다.');
    }

    if (!getGroupMember(groupId)) {
      return error(403, 'GROUP_ACCESS_DENIED', '그룹 멤버만 약속 방을 생성할 수 있습니다.');
    }

    const { roomName } = (await request.json()) as { roomName?: string };

    if (!roomName?.trim()) {
      return error(400, 'INVALID_ROOM_NAME', '방 이름을 입력해주세요.');
    }

    const now = new Date().toISOString();
    const room = {
      roomId: createRoomId(),
      groupId,
      roomName: roomName.trim(),
      status: 'VOTING' as const,
      creatorId: currentUserId(),
      promiseDate: now,
      createdAt: now,
    };

    roomsDb.push(room);
    roomMembersDb.push({
      roomMemberId: createRoomMemberId(),
      roomId: room.roomId,
      userId: currentUserId(),
      nickname: mockDb.auth.currentUser.nickname,
      role: 'HOST',
      bankName: '',
      accountNumber: '',
    });

    const response: RoomCreateResponse = ok(
      {
        roomId: room.roomId,
        groupId: room.groupId,
        roomName: room.roomName,
        status: room.status,
        creatorId: room.creatorId,
        createdAt: room.createdAt,
      },
      '방 생성에 성공했습니다.',
    );

    return HttpResponse.json(response);
  }),

  http.patch(`${BASE}/api/v1/groups/rooms/:roomId/step`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = findRoom(roomId);

    if (!room) {
      return error(404, 'ROOM_NOT_FOUND', '방 정보를 찾을 수 없습니다.');
    }

    if (room.creatorId !== currentUserId()) {
      return error(403, 'ROOM_PERMISSION_DENIED', '방장만 진행 단계를 변경할 수 있습니다.');
    }

    const { nextStatus } = (await request.json()) as { nextStatus?: unknown };

    if (!isRoomStatus(nextStatus)) {
      return error(400, 'INVALID_ROOM_STATUS', '다음 방 상태를 입력해주세요.');
    }

    room.status = nextStatus;
    room.updatedAt = new Date().toISOString();

    const response: RoomStepResponse = ok(
      {
        roomId: room.roomId,
        currentStatus: room.status,
        updatedAt: room.updatedAt,
      },
      '방 단계 변경에 성공했습니다.',
    );

    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/api/v1/groups/:groupId/rooms`, ({ params }) => {
    const groupId = Number(params.groupId);

    if (!findGroup(groupId)) {
      return error(404, 'GROUP_NOT_FOUND', '그룹 정보를 찾을 수 없습니다.');
    }

    if (!getGroupMember(groupId)) {
      return error(403, 'GROUP_ACCESS_DENIED', '그룹 멤버만 약속 방 목록을 조회할 수 있습니다.');
    }

    const response: RoomListResponse = ok(
      {
        rooms: activeRooms()
          .filter((room) => room.groupId === groupId)
          .map(({ roomId, roomName, status, promiseDate }) => ({
            roomId,
            roomName,
            status,
            promiseDate,
          })),
      },
      '방 목록 조회에 성공했습니다.',
    );

    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/api/v1/groups/rooms/:roomId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const room = findRoom(roomId);

    if (!room) {
      return error(404, 'ROOM_NOT_FOUND', '방 정보를 찾을 수 없습니다.');
    }

    if (!getGroupMember(room.groupId)) {
      return error(403, 'ROOM_ACCESS_DENIED', '방 접근 권한이 없습니다.');
    }

    const response: RoomStatusResponse = ok(
      {
        roomId: room.roomId,
        roomName: room.roomName,
        status: room.status,
        currentStep: getCurrentStep(room.status),
        members: getRoomMembers(room.roomId).map(({ userId, nickname, role }) => ({
          userId,
          nickname,
          role: mapRoomRole(role),
        })),
      },
      '방 상태 및 멤버 현황 조회에 성공했습니다.',
    );

    return HttpResponse.json(response);
  }),

  http.delete(`${BASE}/api/v1/groups/rooms/:roomId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const room = findRoom(roomId);

    if (!room) {
      return error(404, 'ROOM_NOT_FOUND', '방 정보를 찾을 수 없습니다.');
    }

    if (room.creatorId !== currentUserId()) {
      return error(403, 'ROOM_PERMISSION_DENIED', '방장만 방을 종료할 수 있습니다.');
    }

    room.deletedAt = new Date().toISOString();

    const response: RoomCloseResponse = ok(
      {
        roomId: room.roomId,
        status: room.status,
        deletedAt: room.deletedAt,
      },
      '방 종료에 성공했습니다.',
    );

    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/rooms/:roomId`, ({ params }) => {
    const roomId = Number(params.roomId);
    const room = findRoom(roomId);

    if (!room) {
      return error(404, 'ROOM_NOT_FOUND', '방 정보를 찾을 수 없습니다.');
    }

    const group = findGroup(room.groupId);
    const response: RoomDetailResponse = ok(
      {
        roomId: room.roomId,
        groupId: room.groupId,
        groupName: group?.groupName ?? '그룹 이름',
        roomName: room.roomName,
        status: room.status,
        currentStep: getCurrentStep(room.status),
        promiseDate: room.promiseDate,
        createdAt: room.createdAt,
        members: getRoomMembers(room.roomId),
      },
      '방 상세 조회 성공',
    );

    return HttpResponse.json(response);
  }),
];
