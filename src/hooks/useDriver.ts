import { useCallback, useState } from "react";
import type { DriverEntity } from "@/core/entity/driverEntity";
import { DriverService } from "@/core/service/driverService";
import { handleError } from "@/errors/handleError";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível buscar os dados do motorista.";
}

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
      setError(getErrorMessage(e));
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
