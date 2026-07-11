import { type BarcodeScanningResult, CameraView } from "expo-camera";
import { View } from "react-native";
import { QrCodeScannerFrame } from "@/presentation/shared/components/molecules/qrCodeScannerFrame";

interface QrCodeScannerViewProps {
  readonly active: boolean;
  readonly isProcessing?: boolean;
  readonly helperText?: string;
  readonly onScan: (result: BarcodeScanningResult) => void;
}

function QrCodeScannerView({
  active,
  isProcessing = false,
  helperText,
  onScan,
}: QrCodeScannerViewProps) {
  return (
    <View className="h-[420px] overflow-hidden rounded-[28px] bg-[#051223]">
      <CameraView
        active={active && !isProcessing}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={active && !isProcessing ? onScan : undefined}
        style={{ flex: 1 }}
      />

      <View className="absolute inset-0 bg-black/20" />
      <QrCodeScannerFrame helperText={helperText} />
    </View>
  );
}

export { QrCodeScannerView };
