import { createContext } from "react";

interface SessionContextData {
  session: string | null;
  firstAccess: boolean;
  loading: boolean;
  refreshSession: () => Promise<void>;
  applySession: (session: string, firstAccess: boolean) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextData | null>(null);

export { SessionContext };
