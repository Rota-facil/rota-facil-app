import { useContext } from "react";
import { SessionContext } from "@/context/model/sessionContext";

/**
 * Hook responsável por ler a sessão autenticada mantida pelo SessionProvider.
 * Expõe token de sessão, estado de primeiro acesso e loading de inicialização.
 * Use este hook para leitura; para atualizar a sessão, use useSessionActions.
 **/
function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession deve ser usado dentro de SessionProvider");
  }

  return {
    session: context.session,
    firstAccess: context.firstAccess,
    loading: context.loading,
  };
}

export { useSession };
