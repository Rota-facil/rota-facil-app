import { AuthService } from "@/core/service/authService";
import { BackgroundError, HttpClientError, HttpServerError, SoftError } from "./errors";
import { logError, showError } from "./showError";

function handleError(error: unknown) {
  if (error instanceof HttpServerError && error.status === 401) {
    error.handleError();
    void AuthService.logout().catch((logoutError: unknown) => {
      if (logoutError instanceof Error) {
        logError(logoutError.message);
      }
    });
    return;
  }

  if (
    error instanceof HttpServerError ||
    error instanceof HttpClientError ||
    error instanceof SoftError ||
    error instanceof BackgroundError
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
