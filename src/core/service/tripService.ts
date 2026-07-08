import type {
  JoinTripPayload,
  TripEntity,
  TripListParams,
  TripPageResultEntity,
  TripUserEntity,
} from "@/core/entity/tripEntity";
import { Mapper } from "@/core/mappers/mappers";
import { TripRequest } from "@/http/request/tripRequest";
import { getRequiredAccessToken } from "./sessionTokenService";

/**
 * Serviço de viagens do estudante.
 * Orquestra token, payload interno e conversão entre contratos HTTP e entidades.
 */
const TripService = {
  async joinTrip(tripId: string, payload: JoinTripPayload): Promise<TripUserEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.joinTrip(token, tripId, {
      boardPointId: payload.boardPointId,
      institutionId: payload.institutionId,
      going: payload.going,
      return_: payload.returning,
    });

    return Mapper.trip.toTripUserEntity(dto);
  },

  async exitTrip(tripId: string): Promise<void> {
    const token = await getRequiredAccessToken();

    await TripRequest.exitTrip(token, tripId);
  },

  async checkInTrip(tripId: string): Promise<TripUserEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.checkInTrip(token, tripId);

    return Mapper.trip.toTripUserEntity(dto);
  },

  async getTrips(params?: TripListParams): Promise<TripPageResultEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.getTrips(token, params);

    return Mapper.trip.toPageEntity(dto);
  },

  async getMyTrips(params?: TripListParams): Promise<TripPageResultEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.getMyTrips(token, params);

    return Mapper.trip.toPageEntity(dto);
  },

  async getTrip(tripId: string): Promise<TripEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.getTrip(token, tripId);

    return Mapper.trip.toEntity(dto);
  },
};

export { TripService };
