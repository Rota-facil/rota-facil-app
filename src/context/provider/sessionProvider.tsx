import { useCallback, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, StorageService } from "@/core/service/storageService";
import { SessionContext } from "../model/sessionContext";

interface Props {
  children: React.ReactNode;
}

function SessionProvider({ children }: Props) {
  const [session, setSession] = useState<string | null>(null);
  const [firstAccess, setFirstAccess] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((sessionToken: string, firstAccessValue: boolean) => {
    setSession(sessionToken);
    setFirstAccess(firstAccessValue);
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
    setFirstAccess(true);
  }, []);

  const refreshSession = useCallback(async () => {
    setLoading(true);

    try {
      const [storedSession, storedFirstAccess] = await Promise.all([
        StorageService.get<string>(STORAGE_KEYS.AUTH_TOKEN),
        StorageService.get<boolean>(STORAGE_KEYS.FIRST_ACCESS),
      ]);

      setSession(storedSession);
      setFirstAccess(storedFirstAccess ?? true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      session,
      loading,
      firstAccess,
      refreshSession,
      applySession,
      clearSession,
    }),
    [session, loading, firstAccess, refreshSession, applySession, clearSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export { SessionProvider };
