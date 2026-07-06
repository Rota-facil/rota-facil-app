import { useContext } from "react";
import { SessionContext } from "@/context/model/sessionContext";

/**
 * Hook responsável por expor comandos de sessão para fluxos como login e logout.
 * Permite recarregar a sessão persistida, aplicar uma sessão recém-autenticada
 * e limpar os dados em memória após encerramento de sessão.
 **/
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
