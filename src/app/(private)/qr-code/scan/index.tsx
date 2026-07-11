import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { QR_CODE_TYPES, type QrCodeScanResult, type QrCodeType } from "@/core/entity/qrCodeEntity";
import { useTrips } from "@/hooks/useTrips";
import { QrCodeScannerScreen } from "@/presentation/shared/screens/QrCodeScannerScreen";

function getParamValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getExpectedType(value: string | string[] | undefined): QrCodeType | undefined {
  const expectedType = getParamValue(value);

  if (expectedType === QR_CODE_TYPES.TRIP_CHECK_IN) {
    return expectedType;
  }

  return undefined;
}

function QrCodeScanPage() {
  const { checkInTrip } = useTrips();
  const params = useLocalSearchParams<{
    description?: string;
    expectedTripId?: string;
    expectedType?: string;
    successDescription?: string;
    successTitle?: string;
    title?: string;
  }>();
  const expectedType = getExpectedType(params.expectedType);
  const expectedTripId = getParamValue(params.expectedTripId);

  const handleResult = useCallback(
    async (result: QrCodeScanResult) => {
      if (result.type !== QR_CODE_TYPES.TRIP_CHECK_IN || !result.tripId) {
        return false;
      }

      const checkedInTrip = await checkInTrip(result.tripId);

      return Boolean(checkedInTrip);
    },
    [checkInTrip],
  );

  return (
    <QrCodeScannerScreen
      title={getParamValue(params.title)}
      description={getParamValue(params.description)}
      successTitle={getParamValue(params.successTitle)}
      successDescription={getParamValue(params.successDescription)}
      expectedType={expectedType}
      expectedTripId={expectedTripId}
      onResult={expectedType === QR_CODE_TYPES.TRIP_CHECK_IN ? handleResult : undefined}
    />
  );
}

export default QrCodeScanPage;
