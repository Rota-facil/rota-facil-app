import { useCallback, useState } from "react";
import type { BusEntity } from "@/core/entity/BusEntity";
import { BusService } from "@/core/service/busService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

/**
 * Hook responsável por buscar dados de um ônibus e expor o estado da operação.
 * Mantém ônibus carregado, loading e erro local sem acoplar a UI ao transporte.
 */
function useBus() {
  const [bus, setBus] = useState<BusEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBus = useCallback(async (busId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await BusService.getBus(busId);
      setBus(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível buscar os dados do ônibus."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearBus = useCallback(() => {
    setBus(null);
    setError(null);
  }, []);

  return {
    bus,
    isLoading,
    error,
    loadBus,
    clearBus,
  };
}

export { useBus };
