import { http, HttpResponse, type HttpHandler } from 'msw';
import { mockDb } from '@/mocks/fixtures/mockDb';
import { departuresDb, type DepartureDbItem } from '@/mocks/db/departure';
import type { DepartureListResponse, RegisterDepartureRequest } from '@/features/departure/types/departure';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const mutableDepartures: DepartureDbItem[] = departuresDb.map((d) => ({ ...d }));
let nextDepartureId = 100;

export const departureHandlers: HttpHandler[] = [
  http.get(`${BASE}/rooms/:roomId/departure`, ({ params }) => {
    const roomId = Number(params.roomId);
    const roomDepartures = mutableDepartures.filter((d) => d.roomId === roomId);

    const response: DepartureListResponse = {
      roomId,
      submittedCount: roomDepartures.length,
      departures: roomDepartures.map(({ departureId, userId, placeName, address, latitude, longitude, transportType }) => ({
        departureId, userId, placeName, address, latitude, longitude, transportType,
      })),
    };
    return HttpResponse.json(response);
  }),

  http.post(`${BASE}/rooms/:roomId/departure`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const currentUserId = window.location.pathname.includes('/participant/')
      ? 3
      : mockDb.auth.currentUser.userId;
    const body = (await request.json()) as RegisterDepartureRequest;
    const existing = mutableDepartures.find((d) => d.roomId === roomId && d.userId === currentUserId);

    if (existing) {
      return HttpResponse.json({ message: '이미 등록된 출발지가 있습니다.' }, { status: 409 });
    }

    const currentMember = mockDb.roomMembers.find((m) => m.roomId === roomId && m.userId === currentUserId);
    const newItem: DepartureDbItem = {
      departureId: nextDepartureId++,
      roomId,
      userId: currentUserId,
      nickname: currentMember?.nickname ?? mockDb.auth.currentUser.nickname,
      ...body,
    };
    mutableDepartures.push(newItem);

    return HttpResponse.json(
      {
        departureId: newItem.departureId,
        roomId,
        userId: currentUserId,
        placeName: body.placeName,
        latitude: body.latitude,
        longitude: body.longitude,
        transportType: body.transportType,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  http.patch(`${BASE}/rooms/:roomId/departure`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const currentUserId = window.location.pathname.includes('/participant/')
      ? 3
      : mockDb.auth.currentUser.userId;
    const existingIndex = mutableDepartures.findIndex((d) => d.roomId === roomId && d.userId === currentUserId);

    if (existingIndex === -1) {
      return HttpResponse.json({ message: '등록된 출발지가 없습니다.' }, { status: 404 });
    }

    const body = (await request.json()) as RegisterDepartureRequest;
    mutableDepartures[existingIndex] = { ...mutableDepartures[existingIndex], ...body };
    const updated = mutableDepartures[existingIndex];

    return HttpResponse.json({
      departureId: updated.departureId,
      roomId,
      userId: currentUserId,
      placeName: updated.placeName,
      latitude: updated.latitude,
      longitude: updated.longitude,
      transportType: updated.transportType,
      updatedAt: new Date().toISOString(),
    });
  }),
];
