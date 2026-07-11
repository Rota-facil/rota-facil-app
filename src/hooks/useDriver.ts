import { useCallback, useState } from "react";
import type { DriverEntity } from "@/core/entity/driverEntity";
import { DriverService } from "@/core/service/driverService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";

function useDriver() {
  const [driver, setDriver] = useState<DriverEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDriver = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await DriverService.me();
      setDriver(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível buscar os dados do motorista."));
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearDriver = useCallback(() => {
    setDriver(null);
    setError(null);
  }, []);

  return {
    driver,
    isLoading,
    error,
    loadDriver,
    clearDriver,
  };
}

export { useDriver };
