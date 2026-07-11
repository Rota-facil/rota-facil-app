import { useCallback, useState } from "react";
import type { EvaluateUserPayload, EvaluationEntity } from "@/core/entity/evaluationEntity";
import type {
  CancelTripPayload,
  ProcessTripPositionPayload,
  SimpleTripUserEntity,
  TripEntity,
} from "@/core/entity/tripEntity";
import { TripService } from "@/core/service/tripService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

/**
 * Hook responsável por adaptar as operações de viagem do motorista para a UI.
 * Expõe início, cancelamento, envio síncrono de posição, listagem de estudantes
 * e avaliação de estudante sem acoplar a apresentação aos contratos HTTP.
 * O agendamento periódico da localização fica sob responsabilidade da tela.
 */
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

  const initTrip = useCallback(async (tripId: string) => {
    setIsLoading(true);
    setError(null);
    setInitTripError(null);

    try {
      const data = await TripService.initTrip(tripId);
      setTrip(data);

      return data;
    } catch (e: unknown) {
      const message = getErrorMessage(e, "Não foi possível iniciar a viagem.");

      setError(message);
      setInitTripError(message);
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const loadTripStudents = useCallback(async (tripId: string) => {
    setIsLoading(true);
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
      setIsLoading(false);
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
    cancelTrip,
    sendTripPosition,
    loadTripStudents,
    evaluateStudent,
    clearDriverTrip,
  };
}

export { useDriverTrips };
