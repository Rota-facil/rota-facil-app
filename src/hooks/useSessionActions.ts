import { useContext } from "react";
import { SessionContext } from "@/context/model/sessionContext";

function useSessionActions() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSessionActions deve ser usado dentro de SessionProvider");
  }

  return {
    refreshSession: context.refreshSession,
    applySession: context.applySession,
    clearSession: context.clearSession,
  };
}

export { useSessionActions };
