import { useLocalSearchParams } from "expo-router";
import { QR_CODE_TYPES, type QrCodeType } from "@/core/entity/qrCodeEntity";
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
  const params = useLocalSearchParams<{
    description?: string;
    expectedTripId?: string;
    expectedType?: string;
    successDescription?: string;
    successTitle?: string;
    title?: string;
  }>();

  return (
    <QrCodeScannerScreen
      title={getParamValue(params.title)}
      description={getParamValue(params.description)}
      successTitle={getParamValue(params.successTitle)}
      successDescription={getParamValue(params.successDescription)}
      expectedType={getExpectedType(params.expectedType)}
      expectedTripId={getParamValue(params.expectedTripId)}
    />
  );
}

export default QrCodeScanPage;
