import { useCallback, useState } from "react";
import type { PrefectureEntity } from "@/core/entity/prefectureEntity";
import { PrefectureService } from "@/core/service/prefectureService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

/**
 * Hook responsável por buscar prefeituras e expor o estado dessa operação.
 * Mantém a lista, a prefeitura selecionada, loading e erro local.
 * Use as ações expostas para carregar a lista, carregar uma prefeitura por id
 * ou limpar a prefeitura selecionada. A troca de prefeitura retorna boolean para
 * que a tela só atualize o usuário e navegue quando a alteração for confirmada.
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
      setError(getErrorMessage(e, "Não foi possível buscar os dados da prefeitura."));
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
      setError(getErrorMessage(e, "Não foi possível buscar os dados da prefeitura."));
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
      return true;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível buscar os dados da prefeitura."));
      handleError(e);
      return false;
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
