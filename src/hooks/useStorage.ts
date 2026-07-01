import { useCallback, useEffect, useState } from "react";
import { StorageError } from "@/errors/storageError";
import { STORAGE_KEYS, StorageService } from "../core/service/storageService";

export function useStorage() {
  const [token, setToken] = useState<string | null>(null);
  const [firstAccess, setFirstAccess] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<StorageError | null>(null);

  const getToken = useCallback(async () => {
    try {
      const data = await StorageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
      setToken(data);
    } catch (err) {
      const storageError = err instanceof StorageError ? err : new StorageError(String(err));
      setError(storageError);
    }
  }, []);

  const getFirstAccess = useCallback(async () => {
    try {
      const data = await StorageService.get<boolean>(STORAGE_KEYS.FIRST_ACCESS);
      setFirstAccess(data);
    } catch (err) {
      const storageError = err instanceof StorageError ? err : new StorageError(String(err));
      setError(storageError);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getToken(), getFirstAccess()]).finally(() => setIsLoading(false));
  }, [getToken, getFirstAccess]);

  return { token, firstAccess, isLoading, error };
}
