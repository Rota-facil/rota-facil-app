function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringMessage(value: unknown): string | null {
  if (typeof value === "string" && value) {
    return value;
  }

  return null;
}

function extractNestedErrorMessage(value: unknown): string | null {
  const message = getStringMessage(value);

  if (message) {
    return message;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const itemMessage = extractNestedErrorMessage(item);

      if (itemMessage) {
        return itemMessage;
      }
    }
  }

  if (isRecord(value)) {
    const knownMessage =
      getStringMessage(value.message) ??
      getStringMessage(value.defaultMessage) ??
      getStringMessage(value.error);

    if (knownMessage) {
      return knownMessage;
    }

    for (const fieldMessage of Object.values(value)) {
      const nestedMessage = extractNestedErrorMessage(fieldMessage);

      if (nestedMessage) {
        return nestedMessage;
      }
    }
  }

  return null;
}

function extractErrorMessage(body: unknown): string | null {
  if (!isRecord(body)) {
    return null;
  }

  return (
    extractNestedErrorMessage(body.message) ??
    extractNestedErrorMessage(body.errors) ??
    extractNestedErrorMessage(body.fieldErrors) ??
    getStringMessage(body.error)
  );
}

export { extractErrorMessage };
