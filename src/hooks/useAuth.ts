import { type Href, router } from "expo-router";
import { useCallback, useState } from "react";
import { AuthService } from "@/core/service/authService";
import { handleError } from "@/errors/handleError";
import type { CreateUserDTO } from "@/http/dto/createUserDTO";
import type { LoginDTO } from "@/http/dto/loginDTO";
import { useSessionActions } from "./useSessionActions";

const privateRoute = "/(private)" as Href;

/**
 * Hook responsável pelos fluxos de autenticação acionados pela UI.
 * Executa register, login, login com Google e logout via AuthService,
 * sincroniza o SessionProvider quando necessário e controla loading local.
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
        router.replace(privateRoute);
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
        router.replace(privateRoute);
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
    } catch (error) {
      handleError(error);
    } finally {
      clearSession();
      router.replace("/(auth)/login");
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
