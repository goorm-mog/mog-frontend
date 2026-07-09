export type TransportType = 'WALK' | 'CAR' | 'PUBLIC';

export interface DepartureEntry {
  departureId: number;
  userId: number;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  transportType: TransportType;
}

export interface DepartureListResponse {
  roomId: number;
  submittedCount: number;
  departures: DepartureEntry[];
}

export interface RegisterDepartureRequest {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  transportType: TransportType;
}

export interface RegisterDepartureResponse {
  departureId: number;
  roomId: number;
  userId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  transportType: TransportType;
  createdAt: string;
}

export interface UpdateDepartureResponse extends Omit<RegisterDepartureResponse, 'createdAt'> {
  updatedAt: string;
}

export interface SelectedPlace {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
}
