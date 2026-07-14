import { useCallback, useState } from "react";
import type { EvaluateUserPayload, EvaluationEntity } from "@/core/entity/evaluationEntity";
import type {
  CancelTripPayload,
  ProcessTripPositionPayload,
  SimpleTripUserEntity,
  TripEntity,
} from "@/core/entity/tripEntity";
import type {
  LocationPermissionState,
  LocationTrackingState,
} from "@/core/entity/userLocationEntity";
import { LocationPermissionService } from "@/core/service/locationPermissionService";
import { LocationTrackingService } from "@/core/service/locationTrackingService";
import { TripService } from "@/core/service/tripService";
import { BackgroundError } from "@/errors/errors";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

/**
 * Hook responsável por adaptar as operações de viagem do motorista para a UI.
 * Expõe início, cancelamento, envio síncrono de posição, listagem de estudantes
 * e avaliação de estudante sem acoplar a apresentação aos contratos HTTP.
 * O agendamento periódico da localização fica sob responsabilidade da tela.
 */
interface LocationTrackingPreparationResult {
  readonly canStartTrip: boolean;
  readonly shouldStopTrackingOnFailure: boolean;
}

function useDriverTrips() {
  const [trip, setTrip] = useState<TripEntity | null>(null);
  const [students, setStudents] = useState<SimpleTripUserEntity[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPosition, setIsProcessingPosition] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initTripError, setInitTripError] = useState<string | null>(null);
  const [cancelTripError, setCancelTripError] = useState<string | null>(null);
  const [evaluateStudentError, setEvaluateStudentError] = useState<string | null>(null);

  const prepareLocationTracking =
    useCallback(async (): Promise<LocationTrackingPreparationResult> => {
      const currentTrackingState = await LocationTrackingService.getStatus();
      const permissionState = await LocationPermissionService.requestTripStartPermission();
      const permissionMessage = getLocationPermissionStartMessage(permissionState);

      if (permissionMessage) {
        setInitTripError(permissionMessage);
        return { canStartTrip: false, shouldStopTrackingOnFailure: false };
      }

      const trackingState = await LocationTrackingService.start();
      const trackingMessage = getLocationTrackingStartMessage(trackingState);

      if (trackingMessage) {
        setInitTripError(trackingMessage);
        return { canStartTrip: false, shouldStopTrackingOnFailure: false };
      }

      return {
        canStartTrip: true,
        shouldStopTrackingOnFailure: !currentTrackingState.isRegistered,
      };
    }, []);

  const initTrip = useCallback(
    async (tripId: string) => {
      let trackingPreparation: LocationTrackingPreparationResult | null = null;

      setIsLoading(true);
      setError(null);
      setInitTripError(null);

      try {
        trackingPreparation = await prepareLocationTracking();

        if (!trackingPreparation.canStartTrip) {
          return null;
        }

        const data = await TripService.initTrip(tripId);
        setTrip(data);

        return data;
      } catch (e: unknown) {
        if (trackingPreparation?.shouldStopTrackingOnFailure) {
          await stopLocationTrackingAfterFailedTripStart();
        }

        const message = getErrorMessage(e, "Não foi possível iniciar a viagem.");

        setError(message);
        setInitTripError(message);
        handleError(e);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [prepareLocationTracking],
  );

  const initTripReturn = useCallback(
    async (tripId: string) => {
      let trackingPreparation: LocationTrackingPreparationResult | null = null;

      setIsLoading(true);
      setError(null);
      setInitTripError(null);

      try {
        trackingPreparation = await prepareLocationTracking();

        if (!trackingPreparation.canStartTrip) {
          return null;
        }

        const data = await TripService.initTripReturn(tripId);
        setTrip(data);

        return data;
      } catch (e: unknown) {
        if (trackingPreparation?.shouldStopTrackingOnFailure) {
          await stopLocationTrackingAfterFailedTripStart();
        }

        const message = getErrorMessage(e, "Não foi possível iniciar o retorno.");

        setError(message);
        setInitTripError(message);
        handleError(e);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [prepareLocationTracking],
  );
  const cancelTrip = useCallback(async (tripId: string, payload: CancelTripPayload) => {
    setIsLoading(true);
    setError(null);
    setCancelTripError(null);

    try {
      const data = await TripService.cancelTrip(tripId, payload);
      setTrip(data);

      return data;
    } catch (e: unknown) {
      const message = getErrorMessage(e, "Não foi possível cancelar a viagem.");

      setError(message);
      setCancelTripError(message);
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendTripPosition = useCallback(async (payload: ProcessTripPositionPayload) => {
    setIsProcessingPosition(true);
    setError(null);

    try {
      await TripService.processTripPosition(payload);
      return true;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível enviar a posição da viagem."));
      handleError(e);
      return false;
    } finally {
      setIsProcessingPosition(false);
    }
  }, []);

  const loadTripStudents = useCallback(async (tripId: string, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await TripService.getTripStudents(tripId);
      setStudents(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível listar os estudantes da viagem."));
      handleError(e);
      return null;
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  const evaluateStudent = useCallback(async (userId: string, payload: EvaluateUserPayload) => {
    setIsLoading(true);
    setError(null);
    setEvaluateStudentError(null);

    try {
      const data = await TripService.evaluateStudent(userId, payload);
      setEvaluation(data);

      return data;
    } catch (e: unknown) {
      const message = getErrorMessage(e, "Não foi possível avaliar o estudante.");

      setError(message);
      setEvaluateStudentError(message);
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearDriverTrip = useCallback(() => {
    setTrip(null);
    setStudents([]);
    setEvaluation(null);
    setError(null);
    setInitTripError(null);
    setCancelTripError(null);
    setEvaluateStudentError(null);
  }, []);

  return {
    trip,
    students,
    evaluation,
    isLoading,
    isProcessingPosition,
    error,
    initTripError,
    cancelTripError,
    evaluateStudentError,
    initTrip,
    initTripReturn,
    cancelTrip,
    sendTripPosition,
    loadTripStudents,
    evaluateStudent,
    clearDriverTrip,
  };
}

function getLocationPermissionStartMessage(
  permissionState: LocationPermissionState,
): string | null {
  if (!permissionState.servicesEnabled) {
    return "Ative a localização do dispositivo antes de iniciar a viagem.";
  }

  if (permissionState.foreground !== "granted") {
    return permissionState.canAskForeground
      ? "Permita a localização enquanto usa o app antes de iniciar a viagem."
      : "A localização enquanto usa o app está bloqueada. Ative a permissão nas configurações do dispositivo para iniciar a viagem.";
  }

  if (permissionState.background !== "granted") {
    return permissionState.canAskBackground
      ? "Permita a localização em segundo plano para iniciar a viagem."
      : "A localização em segundo plano está bloqueada. Ative a permissão nas configurações do dispositivo para iniciar a viagem.";
  }

  return null;
}

function getLocationTrackingStartMessage(trackingState: LocationTrackingState): string | null {
  if (trackingState.status === "tracking") {
    return null;
  }

  if (trackingState.status === "blocked") {
    return "Permita a localização em segundo plano para iniciar a viagem.";
  }

  if (trackingState.status === "unavailable") {
    return "A localização do dispositivo está indisponível. Ative a localização antes de iniciar a viagem.";
  }

  if (trackingState.status === "error") {
    return "Não foi possível iniciar o rastreamento de localização da viagem.";
  }

  return "A localização ainda não está em acompanhamento. Tente iniciar a viagem novamente.";
}

async function stopLocationTrackingAfterFailedTripStart(): Promise<void> {
  try {
    await LocationTrackingService.stop();
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Não foi possível parar a localização após falha.");

    handleError(new BackgroundError(message));
  }
}

export { useDriverTrips };
