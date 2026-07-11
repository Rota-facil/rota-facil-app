import { useCallback, useState } from "react";
import type {
  BoardPointEntity,
  InstitutionEntity,
  PlaceListParams,
  PlacePageEntity,
} from "@/core/entity/placeEntity";
import { PlaceService } from "@/core/service/placeService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

/**
 * Hook responsável por adaptar as consultas de locais para a UI.
 * Expõe listas paginadas de instituições e pontos de embarque sem acoplar
 * apresentação aos contratos HTTP ou ao armazenamento do token.
 */
function usePlaces() {
  const [institutions, setInstitutions] = useState<InstitutionEntity[]>([]);
  const [institutionsPage, setInstitutionsPage] = useState<PlacePageEntity | null>(null);
  const [boardPoints, setBoardPoints] = useState<BoardPointEntity[]>([]);
  const [boardPointsPage, setBoardPointsPage] = useState<PlacePageEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInstitutions = useCallback(async (params?: PlaceListParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await PlaceService.getInstitutions(params);
      setInstitutions(data.content);
      setInstitutionsPage(data.page);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível buscar as instituições."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadBoardPoints = useCallback(async (params?: PlaceListParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await PlaceService.getBoardPoints(params);
      setBoardPoints(data.content);
      setBoardPointsPage(data.page);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível buscar os pontos de embarque."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPlaces = useCallback(() => {
    setInstitutions([]);
    setInstitutionsPage(null);
    setBoardPoints([]);
    setBoardPointsPage(null);
    setError(null);
  }, []);

  return {
    institutions,
    institutionsPage,
    boardPoints,
    boardPointsPage,
    isLoading,
    error,
    loadInstitutions,
    loadBoardPoints,
    clearPlaces,
  };
}

export { usePlaces };
