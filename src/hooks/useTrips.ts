import { useCallback, useState } from "react";
import type {
  JoinTripPayload,
  TripEntity,
  TripListParams,
  TripPageEntity,
  TripUserEntity,
} from "@/core/entity/tripEntity";
import { TripService } from "@/core/service/tripService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

/**
 * Hook responsável por adaptar as operações de viagens do estudante para a UI.
 * Expõe listagem paginada, minhas viagens, busca por id, entrada, saída e check-in.
 * Mantém estado local de loading, erro e últimos dados carregados sem acoplar
 * apresentação aos contratos HTTP ou ao armazenamento do token.
 */
function useTrips() {
  const [trips, setTrips] = useState<TripEntity[]>([]);
  const [tripsPage, setTripsPage] = useState<TripPageEntity | null>(null);
  const [myTrips, setMyTrips] = useState<TripEntity[]>([]);
  const [trip, setTrip] = useState<TripEntity | null>(null);
  const [tripUser, setTripUser] = useState<TripUserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = useCallback(async (params?: TripListParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await TripService.getTrips(params);
      setTrips(data.content);
      setTripsPage(data.page);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação da viagem."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMyTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await TripService.getMyTrips();
      setMyTrips(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação da viagem."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTrip = useCallback(async (tripId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await TripService.getTrip(tripId);
      setTrip(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação da viagem."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinTrip = useCallback(async (tripId: string, payload: JoinTripPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await TripService.joinTrip(tripId, payload);
      setTripUser(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação da viagem."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exitTrip = useCallback(async (tripId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await TripService.exitTrip(tripId);
      setTripUser(null);

      return true;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação da viagem."));
      handleError(e);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkInTrip = useCallback(async (tripId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await TripService.checkInTrip(tripId);
      setTripUser(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação da viagem."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearTrip = useCallback(() => {
    setTrip(null);
    setTripUser(null);
    setError(null);
  }, []);

  const clearTrips = useCallback(() => {
    setTrips([]);
    setTripsPage(null);
    setMyTrips([]);
    setError(null);
  }, []);

  return {
    trips,
    tripsPage,
    myTrips,
    myTripsPage: null,
    trip,
    tripUser,
    isLoading,
    error,
    loadTrips,
    loadMyTrips,
    loadTrip,
    joinTrip,
    exitTrip,
    checkInTrip,
    clearTrip,
    clearTrips,
  };
}

export { useTrips };
