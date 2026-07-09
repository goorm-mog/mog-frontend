import { http, HttpResponse, type HttpHandler } from 'msw';
import { midpointDb } from '@/mocks/db/midpoint';
import type { ConfirmPlaceRequest, ConfirmedPlaceResponse } from '@/features/midpoint/types/midpoint';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export const midpointHandlers: HttpHandler[] = [
  http.get(`${BASE}/rooms/:roomId/midpoint`, () => {
    return HttpResponse.json(midpointDb);
  }),

  http.post(`${BASE}/rooms/:roomId/midpoint/calculate`, ({ params }) => {
    return HttpResponse.json({ ...midpointDb, roomId: Number(params.roomId) });
  }),

  http.post(`${BASE}/rooms/:roomId/midpoint/confirm`, async ({ params, request }) => {
    const body = (await request.json()) as ConfirmPlaceRequest;
    const response: ConfirmedPlaceResponse = {
      confirmedPlaceId: 1,
      roomId: Number(params.roomId),
      kakaoPlaceId: body.kakaoPlaceId,
      placeName: body.placeName,
      address: body.address,
      category: body.category,
      latitude: body.latitude,
      longitude: body.longitude,
      confirmedAt: new Date().toISOString(),
    };
    return HttpResponse.json(response);
  }),
];
