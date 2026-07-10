type JsonParseResult =
  | {
      readonly success: true;
      readonly value: unknown;
    }
  | {
      readonly success: false;
    };

function safeJsonParse(value: string): JsonParseResult {
  try {
    return {
      success: true,
      value: JSON.parse(value),
    };
  } catch {
    return {
      success: false,
    };
  }
}

export type { JsonParseResult };
export { safeJsonParse };
