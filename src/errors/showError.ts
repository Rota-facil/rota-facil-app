function logError(message: string) {
  // log error on sentry
  console.error(message);
}

function showError(message: string) {
  // show error to the user
  console.error(message);
}

export { logError, showError };
