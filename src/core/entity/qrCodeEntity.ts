const QR_CODE_CURRENT_VERSION = 1;

const QR_CODE_TYPES = {
  TRIP_CHECK_IN: "trip-check-in",
} as const;

type QrCodeVersion = typeof QR_CODE_CURRENT_VERSION;
type QrCodeType = (typeof QR_CODE_TYPES)[keyof typeof QR_CODE_TYPES];

interface TripCheckInQrCodePayload {
  readonly tripId: string;
}

interface QrCodePayloadByType {
  readonly [QR_CODE_TYPES.TRIP_CHECK_IN]: TripCheckInQrCodePayload;
}

interface QrCodeEnvelope<TType extends QrCodeType = QrCodeType> {
  readonly type: TType;
  readonly version: QrCodeVersion;
  readonly payload: QrCodePayloadByType[TType];
}

interface TripCheckInQrCodeResult {
  readonly type: typeof QR_CODE_TYPES.TRIP_CHECK_IN;
  readonly tripId: string;
}

type QrCodeScanResult = TripCheckInQrCodeResult;

interface CreateTripCheckInQrCodePayload {
  readonly tripId: string;
}

interface ParseQrCodeOptions {
  readonly expectedType?: QrCodeType;
  readonly expectedTripId?: string;
}

export type {
  CreateTripCheckInQrCodePayload,
  ParseQrCodeOptions,
  QrCodeEnvelope,
  QrCodePayloadByType,
  QrCodeScanResult,
  QrCodeType,
  QrCodeVersion,
  TripCheckInQrCodePayload,
  TripCheckInQrCodeResult,
};
export { QR_CODE_CURRENT_VERSION, QR_CODE_TYPES };
