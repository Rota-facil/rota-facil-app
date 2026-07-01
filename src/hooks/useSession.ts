import { useContext } from "react";
import { SessionContext } from "@/context/model/sessionContext";

/**
 * Hook respnsável pela busca dados do token e verificar se o usuário está desautenticado,
 * caso não exita o token o sistema redireciona o usuário para para login
 **/
function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession deve ser usado dentro de SessionProvider");
  }

  return context;
}

export { useSession };
