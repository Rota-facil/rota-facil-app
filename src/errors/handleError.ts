import { AuthService } from "@/core/service/authService";
import {
  BackgroundError,
  HttpClientError,
  HttpServerError,
  SoftError,
  StorageError,
} from "./errors";
import { notifySessionExpired } from "./sessionExpirationHandler";
import { logError, showError } from "./showError";

function handleError(error: unknown) {
  if (error instanceof HttpServerError && error.status === 401 && error.shouldExpireSession) {
    error.handleError();

    void (async () => {
      try {
        await AuthService.clearLocalSession();
      } catch (sessionError: unknown) {
        if (sessionError instanceof Error) {
          logError(sessionError.message);
        }
      }

      try {
        await notifySessionExpired();
      } catch (sessionExpirationError: unknown) {
        if (sessionExpirationError instanceof Error) {
          logError(sessionExpirationError.message);
        }
      }
    })();

    return;
  }

  if (
    error instanceof HttpServerError ||
    error instanceof HttpClientError ||
    error instanceof SoftError ||
    error instanceof BackgroundError ||
    error instanceof StorageError
  ) {
    error.handleError();
    return;
  }

  if (typeof error === "string") {
    showError(error);
  }

  if (error instanceof Error) {
    logError(error.message);
  }
}

export { handleError };
