import type {
  CancelTripRequestDTO,
  JoinUserInTripRequestDTO,
  ProcessTripPositionParamsDTO,
  SimpleTripUserResponseDTO,
  TripListParamsDTO,
  TripPageResponseDTO,
  TripResponseDTO,
  TripUserResponseDTO,
} from "../dto/tripDTO";
import { httpClient } from "../httpClient/httpClient";

function buildTripListPath(path: string, params?: TripListParamsDTO): string {
  if (!params) {
    return path;
  }

  const queryParams = [
    params.page === undefined ? null : `page=${encodeURIComponent(params.page)}`,
    params.size === undefined ? null : `size=${encodeURIComponent(params.size)}`,
  ].filter((param) => param !== null);

  if (queryParams.length === 0) {
    return path;
  }

  return `${path}?${queryParams.join("&")}`;
}

function buildProcessTripPath(params: ProcessTripPositionParamsDTO): string {
  const queryParams = new URLSearchParams({
    tripId: params.tripId,
    latitude: String(params.latitude),
    longitude: String(params.longitude),
  });

  return `/transports/trips/process?${queryParams.toString()}`;
}

const TripRequest = {
  async joinTrip(
    accessToken: string,
    tripId: string,
    payload: JoinUserInTripRequestDTO,
  ): Promise<TripUserResponseDTO> {
    return httpClient.post<TripUserResponseDTO>(`/transports/trips/${tripId}/join`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async exitTrip(accessToken: string, tripId: string): Promise<void> {
    return httpClient.post<void>(`/transports/trips/${tripId}/exit`, undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async checkInTrip(accessToken: string, tripId: string): Promise<TripUserResponseDTO> {
    return httpClient.post<TripUserResponseDTO>(`/transports/trips/${tripId}/checkin`, undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async getTrips(accessToken: string, params?: TripListParamsDTO): Promise<TripPageResponseDTO> {
    return httpClient.get<TripPageResponseDTO>(buildTripListPath("/transports/trips", params), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async getMyTrips(accessToken: string, params?: TripListParamsDTO): Promise<TripPageResponseDTO> {
    return httpClient.get<TripPageResponseDTO>(
      buildTripListPath("/transports/trips/my-trips", params),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  },

  async getTrip(accessToken: string, tripId: string): Promise<TripResponseDTO> {
    return httpClient.get<TripResponseDTO>(`/transports/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async processTripPosition(
    accessToken: string,
    params: ProcessTripPositionParamsDTO,
  ): Promise<void> {
    return httpClient.post<void>(buildProcessTripPath(params), undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async initTrip(accessToken: string, tripId: string): Promise<TripResponseDTO> {
    return httpClient.post<TripResponseDTO>(`/transports/trips/${tripId}/init`, undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async cancelTrip(
    accessToken: string,
    tripId: string,
    payload: CancelTripRequestDTO,
  ): Promise<TripResponseDTO> {
    return httpClient.post<TripResponseDTO>(`/transports/trips/${tripId}/cancel`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async getTripStudents(accessToken: string, tripId: string): Promise<SimpleTripUserResponseDTO[]> {
    return httpClient.get<SimpleTripUserResponseDTO[]>(`/transports/trips/${tripId}/students`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export { TripRequest };
