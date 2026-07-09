import { useCallback, useState } from "react";
import type { UserEntity } from "@/core/entity/userEntity";
import { UserService } from "@/core/service/userService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";
import type { UpdateAccountRequestDTO } from "@/http/dto/UserDTO";
import { useSessionActions } from "./useSessionActions";

/**
 * Hook responsável por adaptar as ações de conta do usuário para a UI.
 * Expõe busca do usuário autenticado, atualização cadastral e exclusão de conta,
 * mantendo estado local de usuário, loading e erro da operação.
 * A exclusão retorna boolean para que a apresentação só navegue após confirmação
 * de sucesso e preserve a sessão quando o backend recusar a operação.
 */
function useUser() {
  const { clearSession } = useSessionActions();
  const [user, setUser] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await UserService.me();
      setUser(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação do usuário."));
      handleError(e);

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (payload: UpdateAccountRequestDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await UserService.update(payload);
      setUser(data);

      return data;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação do usuário."));
      handleError(e);

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await UserService.deleteAccount();
      setUser(null);
      clearSession();
      return true;
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Não foi possível executar a ação do usuário."));
      handleError(e);

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    loadUser,
    updateUser,
    deleteAccount,
    clearUser,
  };
}

export { useUser };
