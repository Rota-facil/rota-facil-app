import type {
  JoinUserInTripRequestDTO,
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
};

export { TripRequest };
