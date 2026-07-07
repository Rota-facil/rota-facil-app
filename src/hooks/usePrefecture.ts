import { useCallback, useState } from "react";
import type { PrefectureEntity } from "@/core/entity/prefectureEntity";
import { PrefectureService } from "@/core/service/prefectureService";
import { handleError } from "@/errors/handleError";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível buscar os dados da prefeitura.";
}

/**
 * Hook responsável por buscar prefeituras e expor o estado dessa operação.
 * Mantém a lista, a prefeitura selecionada, loading e erro local.
 * Use as ações expostas para carregar a lista, carregar uma prefeitura por id
 * ou limpar a prefeitura selecionada.
 **/
function usePrefecture() {
  const [prefectures, setPrefectures] = useState<PrefectureEntity[]>([]);
  const [prefecture, setPrefecture] = useState<PrefectureEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPrefectures = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await PrefectureService.getPrefectures();
      setPrefectures(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPrefecture = useCallback(async (prefectureId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await PrefectureService.getPrefecture(prefectureId);
      setPrefecture(data);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPrefecture = useCallback(() => {
    setPrefecture(null);
    setError(null);
  }, []);

  const changeUserPrefecture = useCallback(async (prefectureId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await PrefectureService.changeUserPrefecture(prefectureId);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    prefectures,
    prefecture,
    isLoading,
    error,
    loadPrefectures,
    loadPrefecture,
    changeUserPrefecture,
    clearPrefecture,
  };
}

export { usePrefecture };
