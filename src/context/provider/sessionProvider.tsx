import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS, StorageService } from "@/core/service/storageService";
import { SessionContext } from "../model/sessionContext";

interface Props {
  children: React.ReactNode;
}

function SessionProvider({ children }: Props) {
  const [session, setSession] = useState<string | null>(null);
  const [firstAccess, setFirstAccess] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const token = await StorageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);

      if (!token) {
        router.replace("/login");
        return;
      }

      setSession(token);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFirstAccess = useCallback(async () => {
    try {
      const firstAccessInfo = await StorageService.get<boolean>(STORAGE_KEYS.FIRST_ACCESS);

      if (!firstAccessInfo || firstAccessInfo === null) {
        router.replace("/");
        return;
      }

      setFirstAccess(firstAccessInfo);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handlesession = async () => {
      setLoading(true);
      await Promise.all([loadSession, getFirstAccess]);
      setLoading(false);
    };

    handlesession();
  }, [getFirstAccess, loadSession]);

  return (
    <SessionContext.Provider value={{ session, loading, firstAccess }}>
      {children}
    </SessionContext.Provider>
  );
}

export { SessionProvider };
