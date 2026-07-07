export interface MidpointPlace {
  placeId: number;
  address: string;
  placeName?: string;
  latitude: number;
  longitude: number;
}

export interface MidpointResult {
  middlePointId: number;
  roomId: number;
  latitude: number;
  longitude: number;
  address?: string;    // 실제 API 미제공, MSW 전용
  placeName?: string;  // 실제 API 미제공, MSW 전용
  calculatedAt: string;
  travelTimes: TravelTime[];
  places?: MidpointPlace[]; // 실제 API 미제공, MSW 전용
}

export interface TravelTime {
  userId: number;
  nickname?: string;   // 실제 API 미제공, MSW 전용
  durationMinutes: number;
  transportType: string;
}

export interface DepartureWithLabel {
  userId: number;
  latitude: number;
  longitude: number;
  nickname?: string;        // 실제 API 미제공, MSW 전용
  durationMinutes?: number;
  transportType?: string;
}

export interface ConfirmPlaceRequest {
  kakaoPlaceId: string;
  placeName: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
}

export interface ConfirmedPlaceResponse {
  confirmedPlaceId: number;
  roomId: number;
  kakaoPlaceId: string;
  placeName: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  confirmedAt: string;
}
