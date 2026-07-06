import { logError, showError } from "./showError";

abstract class ApplicationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract handleError(): void;
}

/**
 * We will use this error whenever we receive any error from the server
 * We don't need to log this error as it will be captured by backend itself
 */
class HttpServerError extends ApplicationError {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }

  handleError() {
    showError(this.message);
  }
}

/**
 * We will use this error whenever request fails at client.
 * For example, error while reading token, or parsing response in HttpClient
 *
 * We need to log this error
 */
class HttpClientError extends ApplicationError {
  handleError() {
    logError(this.message);
    showError(this.message);
  }
}

/**
 * We will use this error type when we want to show some message to the user, not log on the server
 * For example, we want to show error message when user click on login without filling phone number, but we don't want to log it
 */
class SoftError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = "SoftError";
  }

  handleError() {
    showError(this.message);
  }
}

/**
 * We will use this error when we want to just log data to the sentry/crashlytics but not show user any popup
 * For example, on listing screen, we are calling a secondary api to load ad, it
 * this api failed we don't want to show error but still want to log it
 */
class BackgroundError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = "BackgroundError";
  }

  handleError() {
    logError(this.message);
  }
}

class StorageError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }

  handleError() {
    showError(this.message);
  }
}

export { BackgroundError, HttpClientError, HttpServerError, SoftError, StorageError };
