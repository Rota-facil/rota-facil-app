import { AuthService } from "@/core/service/authService";
import { BackgroundError, HttpClientError, HttpServerError, SoftError } from "./errors";
import { logError, showError } from "./showError";

function handleError(error: unknown) {
  if (error instanceof HttpServerError && error.status === 401) {
    error.handleError();
    AuthService.logout();
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
