import type { EvaluateUserPayload, EvaluationEntity } from "@/core/entity/evaluationEntity";
import type {
  CancelTripPayload,
  JoinTripPayload,
  ProcessTripPositionPayload,
  SimpleTripUserEntity,
  TripEntity,
  TripListParams,
  TripPageResultEntity,
  TripUserEntity,
} from "@/core/entity/tripEntity";
import { Mapper } from "@/core/mappers/mappers";
import { TripRequest } from "@/http/request/tripRequest";
import { UserRequest } from "@/http/request/userRequest";
import { LocationSyncActiveTripService } from "./locationSyncActiveTripService";
import { getRequiredAccessToken } from "./sessionTokenService";

/**
 * Serviço de viagens.
 * Orquestra token, payloads internos e conversão entre contratos HTTP e entidades.
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

  async getMyTrips(): Promise<TripEntity[]> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.getMyTrips(token);

    return Mapper.trip.toEntityList(dto);
  },

  async getTrip(tripId: string): Promise<TripEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.getTrip(token, tripId);

    return Mapper.trip.toEntity(dto);
  },

  async processTripPosition(payload: ProcessTripPositionPayload): Promise<void> {
    const token = await getRequiredAccessToken();

    await TripRequest.processTripPosition(token, payload);
  },

  async initTrip(tripId: string): Promise<TripEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.initTrip(token, tripId);
    const trip = Mapper.trip.toEntity(dto);

    await LocationSyncActiveTripService.updateFromTrip(trip);

    return trip;
  },

  async initTripReturn(tripId: string): Promise<TripEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.initTripReturn(token, tripId);
    const trip = Mapper.trip.toEntity(dto);

    await LocationSyncActiveTripService.updateFromTrip(trip);

    return trip;
  },

  async cancelTrip(tripId: string, payload: CancelTripPayload): Promise<TripEntity> {
    const token = await getRequiredAccessToken();
    const dto = await TripRequest.cancelTrip(token, tripId, {
      reasonOfCancellation: payload.reasonOfCancellation,
    });
    const trip = Mapper.trip.toEntity(dto);

    await LocationSyncActiveTripService.updateFromTrip(trip);

    return trip;
  },

  async getTripStudents(tripId: string): Promise<SimpleTripUserEntity[]> {
    const token = await getRequiredAccessToken();
    const dtos = await TripRequest.getTripStudents(token, tripId);

    return Mapper.trip.toSimpleTripUserEntityList(dtos);
  },

  async evaluateStudent(userId: string, payload: EvaluateUserPayload): Promise<EvaluationEntity> {
    const token = await getRequiredAccessToken();
    const dto = await UserRequest.evaluateUser(token, userId, {
      feedback: payload.feedback,
      note: payload.note,
    });

    return Mapper.evaluation.toEntity(dto);
  },
};

export { TripService };
