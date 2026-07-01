import { router } from "expo-router";
import { useCallback, useState } from "react";
import { AuthService } from "@/core/service/authService";
import { handleError } from "@/errors/handleError";
import type { CreateUserDTO } from "@/http/dto/createUserDTO";
import type { LoginDTO } from "@/http/dto/loginDTO";

/**
 * Hook responsável por gerenciar e ser uma
 * ponte entre as requisições de autenticação do usuário.
 **/
function useAuth() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [messageError, setErrorMessage] = useState<string | null>(null);

  const register = useCallback(async (credentials: CreateUserDTO) => {
    setLoading(true);

    try {
      const user = await AuthService.register(credentials);

      if (!user.accessToken) {
        return;
      }

      router.replace("/(private)/students/home");
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginDTO) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const user = await AuthService.login(credentials);

      if (!user.accessToken) {
        return;
      }

      router.replace("/(private)/students/home");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

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

      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, []);

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
