import * as Linking from "expo-linking";
import { type Href, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useRef, useState } from "react";
import { AuthService } from "@/core/service/authService";
import type { GoogleLoginResult } from "@/core/service/googleOAuthService";
import { SoftError } from "@/errors/errors";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";
import type { CreateUserDTO } from "@/http/dto/createUserDTO";
import type { CompleteGoogleRegistrationRequestDTO, LoginDTO } from "@/http/dto/loginDTO";
import { useSessionActions } from "./useSessionActions";

const privateRoute = "/(private)/students/home" as Href;
const googleCompleteLoginRoute = "/(auth)/complete-login" as const;
const googleOAuthCallbackBaseUrl = Linking.createURL("auth", {
  isTripleSlashed: false,
  scheme: "rotafacil",
});

WebBrowser.maybeCompleteAuthSession();

/**
 * Hook responsável pelos fluxos de autenticação acionados pela UI.
 * Executa register, login, login com Google e logout via AuthService,
 * sincroniza o SessionProvider quando necessário e controla loading local.
 **/
function useAuth() {
  const { applySession, clearSession } = useSessionActions();
  const googleAuthInProgressRef = useRef(false);
  const googleRegistrationInProgressRef = useRef(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [messageError, setErrorMessage] = useState<string | null>(null);
  const [googleLoginResult, setGoogleLoginResult] = useState<GoogleLoginResult | null>(null);

  const register = useCallback(
    async (credentials: CreateUserDTO) => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const user = await AuthService.register(credentials);

        if (!user.accessToken) {
          return;
        }

        applySession(user.accessToken, false);
        router.replace(privateRoute);
      } catch (e: unknown) {
        setErrorMessage(getErrorMessage(e, "Não foi possível criar sua conta."));
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
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Não foi possível entrar na sua conta."));
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const loginWithGoogle = useCallback(async (): Promise<GoogleLoginResult | null> => {
    if (googleAuthInProgressRef.current) {
      const error = new SoftError("O login Google já está em andamento.");

      setErrorMessage(error.message);
      handleError(error);
      return null;
    }

    googleAuthInProgressRef.current = true;
    setLoading(true);
    setErrorMessage(null);
    setGoogleLoginResult(null);

    try {
      const authUrl = AuthService.getGoogleStudentAuthUrl();
      const authSessionResult = await WebBrowser.openAuthSessionAsync(
        authUrl,
        googleOAuthCallbackBaseUrl,
      );

      if (authSessionResult.type !== "success") {
        const cancelledResult: GoogleLoginResult = { type: "cancelled" };

        setGoogleLoginResult(cancelledResult);
        return cancelledResult;
      }

      const result = await AuthService.google(authSessionResult.url);

      setGoogleLoginResult(result);

      if (result.type === "authenticated") {
        applySession(result.accessToken, false);
        router.replace(privateRoute);
      }

      if (result.type === "registrationRequired") {
        const params = new URLSearchParams({ pendingToken: result.pendingToken });

        router.replace(`${googleCompleteLoginRoute}?${params.toString()}` as Href);
      }

      return result;
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, "Não foi possível entrar com Google."));
      handleError(error);
      return null;
    } finally {
      googleAuthInProgressRef.current = false;
      setLoading(false);
    }
  }, [applySession]);

  const completeGoogleRegistration = useCallback(
    async (pendingToken: string, data: CompleteGoogleRegistrationRequestDTO) => {
      if (googleRegistrationInProgressRef.current) {
        const error = new SoftError("A conclusão do cadastro Google já está em andamento.");

        setErrorMessage(error.message);
        handleError(error);
        return false;
      }

      googleRegistrationInProgressRef.current = true;
      setLoading(true);
      setErrorMessage(null);

      try {
        const user = await AuthService.completeGoogleRegistration(pendingToken, data);

        if (!user.accessToken) {
          return false;
        }

        applySession(user.accessToken, false);
        router.replace(privateRoute);
        return true;
      } catch (error: unknown) {
        setErrorMessage(getErrorMessage(error, "Não foi possível concluir seu cadastro."));
        handleError(error);
        return false;
      } finally {
        googleRegistrationInProgressRef.current = false;
        setLoading(false);
      }
    },
    [applySession],
  );

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
    completeGoogleRegistration,
    logout,
    isLoading,
    messageError,
    googleLoginResult,
  };
}

export { useAuth };
