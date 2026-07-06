import { router } from "expo-router";
import { useCallback, useState } from "react";
import { AuthService } from "@/core/service/authService";
import { handleError } from "@/errors/handleError";
import type { CreateUserDTO } from "@/http/dto/createUserDTO";
import type { LoginDTO } from "@/http/dto/loginDTO";
import { useSessionActions } from "./useSessionActions";

/**
 * Hook responsável por gerenciar e ser uma
 * ponte entre as requisições de autenticação do usuário.
 **/
function useAuth() {
  const { applySession, clearSession } = useSessionActions();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [messageError, setErrorMessage] = useState<string | null>(null);

  const register = useCallback(
    async (credentials: CreateUserDTO) => {
      setLoading(true);

      try {
        const user = await AuthService.register(credentials);

        if (!user.accessToken) {
          return;
        }

        applySession(user.accessToken, false);
        router.replace("/(private)/students/home");
      } catch (e) {
        handleError(e);
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const login = useCallback(
    async (credentials: LoginDTO) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const user = await AuthService.login(credentials);

        if (!user.accessToken) {
          return;
        }

        applySession(user.accessToken, false);
        router.replace("/(private)/students/home");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await AuthService.google();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await AuthService.logout();
      clearSession();

      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  return {
    register,
    login,
    loginWithGoogle,
    logout,
    isLoading,
    messageError,
  };
}

export { useAuth };
