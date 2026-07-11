import type { BarcodeScanningResult, PermissionResponse } from "expo-camera";
import { useCameraPermissions } from "expo-camera";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ParseQrCodeOptions, QrCodeScanResult } from "@/core/entity/qrCodeEntity";
import { QrCodeService } from "@/core/service/qrCodeService";
import { QrCodeError } from "@/errors/errors";

type QrCodePermissionStatus = "checking" | "granted" | "denied" | "blocked" | "undetermined";
type QrCodeScannerStatus = "idle" | "scanning" | "processing" | "success" | "error";

interface UseQrCodeScannerOptions extends ParseQrCodeOptions {
  readonly isEnabled?: boolean;
}

function getPermissionStatus(permission: PermissionResponse | null): QrCodePermissionStatus {
  if (!permission) {
    return "checking";
  }

  if (permission.granted) {
    return "granted";
  }

  if (permission.canAskAgain === false) {
    return "blocked";
  }

  if (permission.status === "undetermined") {
    return "undetermined";
  }

  return "denied";
}

function createPermissionError(status: QrCodePermissionStatus): QrCodeError {
  if (status === "blocked") {
    return new QrCodeError("CAMERA_PERMISSION_BLOCKED", "A permissão da câmera está bloqueada.");
  }

  return new QrCodeError("CAMERA_PERMISSION_DENIED", "A permissão da câmera foi negada.");
}

function useQrCodeScanner(options: UseQrCodeScannerOptions = {}) {
  const isEnabled = options.isEnabled ?? true;
  const parseOptions = useMemo(
    () => ({
      expectedTripId: options.expectedTripId,
      expectedType: options.expectedType,
    }),
    [options.expectedTripId, options.expectedType],
  );
  const [permission, requestCameraPermission] = useCameraPermissions();
  const permissionStatus = getPermissionStatus(permission);
  const [scannerStatus, setScannerStatus] = useState<QrCodeScannerStatus>("idle");
  const [result, setResult] = useState<QrCodeScanResult | null>(null);
  const [error, setError] = useState<QrCodeError | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const isProcessingRef = useRef(false);
  const hasCompletedScanRef = useRef(false);
  const lastScannedValueRef = useRef<string | null>(null);

  const isScanning = isEnabled && permissionStatus === "granted" && scannerStatus === "scanning";
  const isProcessing = scannerStatus === "processing";

  const startScan = useCallback(() => {
    if (!isEnabled || permissionStatus !== "granted") {
      return;
    }

    setScannerStatus("scanning");
  }, [isEnabled, permissionStatus]);

  const resetScan = useCallback(() => {
    isProcessingRef.current = false;
    hasCompletedScanRef.current = false;
    lastScannedValueRef.current = null;
    setResult(null);
    setError(null);
    setScannerStatus(isEnabled && permissionStatus === "granted" ? "scanning" : "idle");
  }, [isEnabled, permissionStatus]);

  const requestPermission = useCallback(async () => {
    setIsRequestingPermission(true);
    setError(null);

    try {
      const response = await requestCameraPermission();
      const nextStatus = getPermissionStatus(response);

      if (nextStatus === "granted") {
        setScannerStatus(isEnabled ? "scanning" : "idle");
        return response;
      }

      const permissionError = createPermissionError(nextStatus);
      setError(permissionError);
      setScannerStatus("error");

      return response;
    } catch {
      const unknownError = new QrCodeError(
        "UNKNOWN",
        "Não foi possível solicitar a permissão da câmera.",
      );
      setError(unknownError);
      setScannerStatus("error");

      return null;
    } finally {
      setIsRequestingPermission(false);
    }
  }, [isEnabled, requestCameraPermission]);

  const handleScan = useCallback(
    (scanResult: BarcodeScanningResult) => {
      if (!isEnabled || permissionStatus !== "granted" || scannerStatus !== "scanning") {
        return null;
      }

      const scannedValue = scanResult.data;

      if (
        isProcessingRef.current ||
        hasCompletedScanRef.current ||
        lastScannedValueRef.current === scannedValue
      ) {
        return null;
      }

      isProcessingRef.current = true;
      lastScannedValueRef.current = scannedValue;
      setScannerStatus("processing");
      setError(null);

      try {
        const parsedResult = QrCodeService.parse(scannedValue, parseOptions);

        hasCompletedScanRef.current = true;
        setResult(parsedResult);
        setScannerStatus("success");

        return parsedResult;
      } catch (scanError: unknown) {
        const normalizedError =
          scanError instanceof QrCodeError
            ? scanError
            : new QrCodeError("UNKNOWN", "Não foi possível ler este QR Code.");

        setError(normalizedError);
        setScannerStatus("error");

        return null;
      } finally {
        isProcessingRef.current = false;
      }
    },
    [isEnabled, parseOptions, permissionStatus, scannerStatus],
  );

  return useMemo(
    () => ({
      permissionStatus,
      scannerStatus,
      isRequestingPermission,
      isScanning,
      isProcessing,
      result,
      error,
      requestPermission,
      startScan,
      handleScan,
      resetScan,
    }),
    [
      permissionStatus,
      scannerStatus,
      isRequestingPermission,
      isScanning,
      isProcessing,
      result,
      error,
      requestPermission,
      startScan,
      handleScan,
      resetScan,
    ],
  );
}

export type { QrCodePermissionStatus, QrCodeScannerStatus, UseQrCodeScannerOptions };
export { useQrCodeScanner };
