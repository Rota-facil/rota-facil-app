import type {
  CreateTripCheckInQrCodePayload,
  ParseQrCodeOptions,
  QrCodeEnvelope,
  QrCodeScanResult,
  QrCodeType,
  TripCheckInQrCodePayload,
} from "@/core/entity/qrCodeEntity";
import { QR_CODE_CURRENT_VERSION, QR_CODE_TYPES } from "@/core/entity/qrCodeEntity";
import { QrCodeError } from "@/errors/errors";
import { safeJsonParse } from "@/utils/json";
import { isRecord } from "@/utils/object";

interface RawQrCodeEnvelope {
  readonly type: QrCodeType;
  readonly version: typeof QR_CODE_CURRENT_VERSION;
  readonly payload: Record<string, unknown>;
}

function isSupportedQrCodeType(value: unknown): value is QrCodeType {
  return value === QR_CODE_TYPES.TRIP_CHECK_IN;
}

function assertValidIdentifier(identifier: string, errorCode: "INVALID_IDENTIFIER") {
  if (identifier.trim().length === 0) {
    throw new QrCodeError(errorCode, "O identificador do QR Code é inválido.");
  }
}

function parseJson(rawValue: string): unknown {
  const result = safeJsonParse(rawValue);

  if (!result.success) {
    throw new QrCodeError("MALFORMED_CONTENT", "O conteúdo do QR Code é inválido.");
  }

  return result.value;
}

function readEnvelope(rawValue: string): RawQrCodeEnvelope {
  const normalizedValue = rawValue.trim();

  if (normalizedValue.length === 0) {
    throw new QrCodeError("EMPTY_CONTENT", "O QR Code está vazio.");
  }

  const parsedValue = parseJson(normalizedValue);

  if (!isRecord(parsedValue)) {
    throw new QrCodeError("EXTERNAL_CONTENT", "Este QR Code não pertence ao Rota Fácil.");
  }

  const { type, version, payload } = parsedValue;

  if (!isSupportedQrCodeType(type)) {
    throw new QrCodeError("EXTERNAL_CONTENT", "Este QR Code não pertence ao Rota Fácil.");
  }

  if (version !== QR_CODE_CURRENT_VERSION) {
    throw new QrCodeError("UNSUPPORTED_VERSION", "Esta versão de QR Code não é suportada.");
  }

  if (!isRecord(payload)) {
    throw new QrCodeError("MALFORMED_CONTENT", "A estrutura do QR Code é inválida.");
  }

  return { type, version, payload };
}

function parseTripCheckInPayload(payload: unknown): TripCheckInQrCodePayload {
  if (!isRecord(payload)) {
    throw new QrCodeError("MALFORMED_CONTENT", "A estrutura do QR Code é inválida.");
  }

  const { tripId } = payload;

  if (typeof tripId !== "string") {
    throw new QrCodeError("INVALID_IDENTIFIER", "O identificador da viagem é inválido.");
  }

  assertValidIdentifier(tripId, "INVALID_IDENTIFIER");

  return { tripId };
}

function toScanResult(envelope: RawQrCodeEnvelope): QrCodeScanResult {
  if (envelope.type === QR_CODE_TYPES.TRIP_CHECK_IN) {
    const payload = parseTripCheckInPayload(envelope.payload);

    return {
      type: QR_CODE_TYPES.TRIP_CHECK_IN,
      tripId: payload.tripId,
    };
  }

  throw new QrCodeError("EXTERNAL_CONTENT", "Este QR Code não pertence ao Rota Fácil.");
}

function validateContext(result: QrCodeScanResult, options?: ParseQrCodeOptions) {
  if (!options) {
    return;
  }

  if (options.expectedType && result.type !== options.expectedType) {
    throw new QrCodeError("INCOMPATIBLE_TYPE", "Este QR Code pertence a outro fluxo.");
  }

  if (result.type === QR_CODE_TYPES.TRIP_CHECK_IN && options.expectedTripId) {
    assertValidIdentifier(options.expectedTripId, "INVALID_IDENTIFIER");

    if (result.tripId !== options.expectedTripId) {
      throw new QrCodeError("INCOMPATIBLE_IDENTIFIER", "Este QR Code pertence a outra viagem.");
    }
  }
}

function createTripCheckInEnvelope(
  payload: CreateTripCheckInQrCodePayload,
): QrCodeEnvelope<typeof QR_CODE_TYPES.TRIP_CHECK_IN> {
  assertValidIdentifier(payload.tripId, "INVALID_IDENTIFIER");

  return {
    type: QR_CODE_TYPES.TRIP_CHECK_IN,
    version: QR_CODE_CURRENT_VERSION,
    payload: {
      tripId: payload.tripId,
    },
  };
}

const QrCodeService = {
  createTripCheckInPayload(payload: CreateTripCheckInQrCodePayload) {
    return createTripCheckInEnvelope(payload);
  },

  serialize(payload: QrCodeEnvelope): string {
    return JSON.stringify(payload);
  },

  createTripCheckInValue(payload: CreateTripCheckInQrCodePayload): string {
    return this.serialize(this.createTripCheckInPayload(payload));
  },

  parse(rawValue: string, options?: ParseQrCodeOptions): QrCodeScanResult {
    const envelope = readEnvelope(rawValue);
    const result = toScanResult(envelope);

    validateContext(result, options);

    return result;
  },
};

export { QrCodeService };
