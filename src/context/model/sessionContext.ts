import { createContext } from "react";

interface SessionContextData {
  session: string | null;
  firstAccess: boolean;
  loading: boolean;
}

const SessionContext = createContext<SessionContextData | null>(null);

export { SessionContext };
