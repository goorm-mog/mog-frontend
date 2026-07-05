import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import { confirmedSchedulesDb, scheduleSlotsDb } from '@/mocks/db/schedule';
import type { RegisteredSlot, ScheduleSlot, SlotsResponse } from '@/types/schedule';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

type MutableRoomSlots = {
  roomId: number;
  totalParticipants: number;
  slots: (Omit<ScheduleSlot, 'votedUserIds'> & { votedUserIds: number[] })[];
};

const mutableSlots: Record<number, MutableRoomSlots> = scheduleSlotsDb.reduce<
  Record<number, MutableRoomSlots>
>((acc, slot) => {
  const { roomId } = slot;
  if (!acc[roomId]) {
    acc[roomId] = {
      roomId,
      totalParticipants: mockDb.roomMembers.filter((m) => m.roomId === roomId).length || 4,
      slots: [],
    };
  }
  acc[roomId].slots.push({
    slotId: slot.slotId,
    date: slot.date,
    time: slot.time,
    voteCount: slot.votedUserIds.length,
    votedUserIds: [...slot.votedUserIds],
  });
  return acc;
}, {});

let nextSlotId = Math.max(0, ...scheduleSlotsDb.map((slot) => slot.slotId)) + 1;
let nextConfirmedId =
  Math.max(0, ...confirmedSchedulesDb.map((schedule) => schedule.confirmedId)) + 1;

type MutableConfirmedSchedule = {
  confirmedId: number;
  roomId: number;
  date: string;
  time: string;
  confirmedBy: number;
  kakaoEventId: string;
  confirmedAt: string;
};

const confirmedSchedules = confirmedSchedulesDb.reduce<Record<number, MutableConfirmedSchedule>>(
  (acc, c) => {
    acc[c.roomId] = {
      confirmedId: c.confirmedId,
      roomId: c.roomId,
      date: c.date,
      time: c.time,
      confirmedBy: c.confirmedBy,
      kakaoEventId: c.kakaoEventId,
      confirmedAt: c.confirmedAt,
    };
    return acc;
  },
  {},
);

export const scheduleHandlers: HttpHandler[] = [
  http.get(`${BASE}/rooms/:roomId/schedule/slots`, ({ params }) => {
    const roomId = Number(params.roomId);
    const data = mutableSlots[roomId];
    if (!data) {
      return HttpResponse.json({ roomId, totalParticipants: 0, slots: [] });
    }
    const response: SlotsResponse = {
      roomId: data.roomId,
      totalParticipants: data.totalParticipants,
      slots: data.slots.map((s) => ({
        slotId: s.slotId,
        date: s.date,
        time: s.time,
        voteCount: s.votedUserIds.length,
        votedUserIds: [...s.votedUserIds],
      })),
    };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/rooms/:roomId/schedule/slots`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const { slots } = (await request.json()) as { slots: { date: string; time: string }[] };

    if (!mutableSlots[roomId]) {
      mutableSlots[roomId] = {
        roomId,
        totalParticipants: mockDb.roomMembers.filter((m) => m.roomId === roomId).length || 4,
        slots: [],
      };
    }

    mutableSlots[roomId].slots = [];

    const newSlots: RegisteredSlot[] = slots.map(({ date, time }) => ({
      slotId: nextSlotId++,
      date,
      time,
    }));

    newSlots.forEach((s) => {
      mutableSlots[roomId].slots.push({ ...s, voteCount: 0, votedUserIds: [] });
    });

    return HttpResponse.json({ roomId, slots: newSlots });
  }),

  http.post(`${BASE}/rooms/:roomId/schedule/votes`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const { slotIds } = (await request.json()) as { slotIds: number[] };
    const currentUserId = mockDb.auth.currentUser.userId;

    const roomData = mutableSlots[roomId];
    if (!roomData) {
      return HttpResponse.json({ message: '방 정보가 없습니다.' }, { status: 404 });
    }

    slotIds.forEach((slotId) => {
      const slot = roomData.slots.find((s) => s.slotId === slotId);
      if (!slot) return;
      const hasVoted = slot.votedUserIds.includes(currentUserId);
      if (hasVoted) {
        slot.votedUserIds = slot.votedUserIds.filter((id) => id !== currentUserId);
      } else {
        slot.votedUserIds = [...slot.votedUserIds, currentUserId];
      }
      slot.voteCount = slot.votedUserIds.length;
    });

    const votedSlotIds = roomData.slots
      .filter((s) => s.votedUserIds.includes(currentUserId))
      .map((s) => s.slotId);

    return HttpResponse.json({ votedSlotIds });
  }),

  http.get(`${BASE}/rooms/:roomId/members`, ({ params }) => {
    const roomId = Number(params.roomId);
    const members = [...mockDb.roomMembers]
      .filter((m) => m.roomId === roomId)
      .map(({ roomMemberId, roomId, userId, nickname, role, bankName, accountNumber }) => ({
        roomMemberId,
        roomId,
        userId,
        nickname,
        role,
        bankName,
        accountNumber,
        profileImageUrl: mockDb.users.find((u) => u.userId === userId)?.profileImageUrl ?? '',
      }));
    return HttpResponse.json({ members });
  }),

  http.get(`${BASE}/rooms/:roomId/schedule/confirm`, ({ params }) => {
    const roomId = Number(params.roomId);
    const confirmed = confirmedSchedules[roomId];
    if (!confirmed) {
      return HttpResponse.json({ message: '확정된 일정이 없습니다.' }, { status: 404 });
    }
    return HttpResponse.json(confirmed);
  }),

  http.patch(`${BASE}/rooms/:roomId/schedule/confirm`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const { date, time } = (await request.json()) as { date: string; time: string };
    const confirmedAt = new Date().toISOString();
    const confirmedId = confirmedSchedules[roomId]?.confirmedId ?? nextConfirmedId++;
    const kakaoEventId = confirmedSchedules[roomId]?.kakaoEventId ?? `mock_kakao_event_${roomId}`;

    confirmedSchedules[roomId] = {
      confirmedId,
      roomId,
      date,
      time,
      confirmedBy: mockDb.auth.currentUser.userId,
      kakaoEventId,
      confirmedAt,
    };
    return HttpResponse.json(confirmedSchedules[roomId]);
  }),
];
