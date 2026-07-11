import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ParseQrCodeOptions, QrCodeScanResult } from "@/core/entity/qrCodeEntity";
import { useQrCodeScanner } from "@/hooks/useQrCodeScanner";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { QrCodeScannerView } from "@/presentation/shared/components/organisms/qrCodeScannerView";
import { colors } from "@/presentation/shared/styles/colors";
import { getQrCodeErrorContent } from "./messages";

interface QrCodeScannerScreenProps extends ParseQrCodeOptions {
  readonly title?: string;
  readonly description?: string;
  readonly successTitle?: string;
  readonly successDescription?: string;
  readonly onResult?: (
    result: QrCodeScanResult,
  ) => boolean | undefined | Promise<boolean | undefined>;
}

function QrCodeScannerScreen({
  title = "Escaneie o QR Code",
  description = "Posicione o codigo dentro da area indicada.",
  successTitle = "QR Code validado",
  successDescription = "O codigo foi lido e validado com sucesso.",
  expectedType,
  expectedTripId,
  onResult,
}: QrCodeScannerScreenProps) {
  const router = useRouter();
  const isFocused = useIsFocused();
  const deliveredResultRef = useRef<QrCodeScanResult | null>(null);
  const {
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
  } = useQrCodeScanner({
    expectedTripId,
    expectedType,
    isEnabled: isFocused,
  });
  const [resultActionStatus, setResultActionStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (isFocused && permissionStatus === "granted" && scannerStatus === "idle") {
      startScan();
    }
  }, [isFocused, permissionStatus, scannerStatus, startScan]);

  useEffect(() => {
    if (!result || deliveredResultRef.current === result) {
      return;
    }

    deliveredResultRef.current = result;

    if (!onResult) {
      setResultActionStatus("success");
      return;
    }

    let isMounted = true;

    setResultActionStatus("processing");

    void Promise.resolve(onResult(result))
      .then((wasHandled) => {
        if (!isMounted) {
          return;
        }

        setResultActionStatus(wasHandled === false ? "error" : "success");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setResultActionStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, [onResult, result]);

  const handleRetry = () => {
    deliveredResultRef.current = null;
    setResultActionStatus("idle");
    resetScan();
  };

  const errorContent = getQrCodeErrorContent(error?.code);
  const isCameraVisible = permissionStatus === "granted" && !result && scannerStatus !== "error";
  const isPermissionChecking = permissionStatus === "checking";
  const canRequestPermission = permissionStatus === "undetermined" || permissionStatus === "denied";
  const isPermissionBlocked = permissionStatus === "blocked";

  return (
    <SafeAreaView className="flex-1 bg-[#F7FBFC]" edges={["top"]}>
      <ScrollView contentContainerClassName="px-6 pt-4 pb-10" showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm shadow-blue-100"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>

        <View className="mt-6">
          <Text className="font-bold text-3xl text-[#051223]">{title}</Text>
          <Text className="mt-2 text-[#5E6A7A] leading-5">{description}</Text>
        </View>

        <View className="mt-6">
          {isPermissionChecking ? (
            <View className="items-center rounded-[28px] bg-white px-5 py-8 shadow-sm shadow-blue-100">
              <ActivityIndicator size="large" color={colors.primaryGlow} />
              <Text className="mt-5 text-center font-bold text-xl text-[#051223]">
                Preparando a camera
              </Text>
              <Text className="mt-2 text-center text-[#5E6A7A]">
                Estamos verificando a permissao de acesso.
              </Text>
            </View>
          ) : null}

          {canRequestPermission ? (
            <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF]">
                <MaterialIcons name="photo-camera" size={26} color={colors.primaryGlow} />
              </View>
              <Text className="mt-5 font-bold text-2xl text-[#051223]">
                Precisamos acessar sua camera
              </Text>
              <Text className="mt-2 text-[#5E6A7A] leading-5">
                A camera e utilizada para ler QR Codes do Rota Facil.
              </Text>
              <View className="mt-6">
                <SystemButton
                  title="Permitir acesso"
                  iconLeft="photo-camera"
                  loading={isRequestingPermission}
                  onPress={() => {
                    void requestPermission();
                  }}
                />
              </View>
            </View>
          ) : null}

          {isPermissionBlocked ? (
            <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <MaterialIcons name="lock" size={26} color={colors.stateError} />
              </View>
              <Text className="mt-5 font-bold text-2xl text-[#051223]">
                Acesso a camera bloqueado
              </Text>
              <Text className="mt-2 text-[#5E6A7A] leading-5">
                Ative a permissao da camera nas configuracoes do dispositivo para utilizar o leitor
                de QR Code.
              </Text>
              <View className="mt-6">
                <SystemButton
                  title="Abrir configuracoes"
                  iconLeft="settings"
                  onPress={() => {
                    void Linking.openSettings();
                  }}
                />
              </View>
            </View>
          ) : null}

          {isCameraVisible ? (
            <QrCodeScannerView
              active={isFocused && isScanning}
              isProcessing={isProcessing}
              helperText="A moldura ajuda no posicionamento do codigo."
              onScan={handleScan}
            />
          ) : null}

          {isProcessing ? (
            <View className="mt-4 flex-row items-center justify-center rounded-2xl bg-white px-4 py-3 shadow-sm shadow-blue-100">
              <ActivityIndicator size="small" color={colors.primaryGlow} />
              <Text className="ml-3 font-semibold text-[#051223]">Verificando QR Code...</Text>
            </View>
          ) : null}

          {scannerStatus === "error" && error ? (
            <View className="min-h-[470px] overflow-hidden rounded-[28px] bg-[#051223] shadow-sm shadow-blue-100">
              <View className="flex-1 justify-between p-5">
                <View>
                  <View className="flex-row items-center justify-between">
                    <View className="rounded-full bg-white/10 px-3 py-1.5">
                      <Text className="font-bold text-[11px] text-white uppercase tracking-wide">
                        Leitura pausada
                      </Text>
                    </View>

                    <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F5A524]">
                      <MaterialIcons name="qr-code-scanner" size={23} color="#051223" />
                    </View>
                  </View>

                  <View className="mt-10 h-24 w-24 items-center justify-center rounded-[32px] bg-white/10">
                    <View className="h-16 w-16 items-center justify-center rounded-3xl bg-white">
                      <MaterialIcons name="priority-high" size={34} color={colors.stateError} />
                    </View>
                  </View>

                  <Text className="mt-8 font-bold text-3xl text-white leading-9">
                    {errorContent.title}
                  </Text>
                  <Text className="mt-3 text-base text-[#DDE7F3] leading-6">
                    {errorContent.description} Centralize o codigo, evite reflexos e confirme se ele
                    foi gerado pelo Rota
                  </Text>
                </View>

                <View>
                  <View className="rounded-[24px] bg-white p-1">
                    <SystemButton
                      title="Tentar novamente"
                      iconLeft="refresh"
                      onPress={handleRetry}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          {result && resultActionStatus === "processing" ? (
            <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
              <ActivityIndicator size="large" color={colors.primaryGlow} />
              <Text className="mt-5 text-center font-bold text-2xl text-[#051223]">
                Registrando check-in
              </Text>
              <Text className="mt-2 text-center text-[#5E6A7A] leading-5">
                O QR Code foi validado. Aguarde enquanto confirmamos a presença.
              </Text>
            </View>
          ) : null}

          {result && resultActionStatus === "error" ? (
            <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <MaterialIcons name="error-outline" size={26} color={colors.stateError} />
              </View>
              <Text className="mt-5 font-bold text-2xl text-[#051223]">
                Não foi possível registrar
              </Text>
              <Text className="mt-2 text-[#5E6A7A] leading-5">
                O QR Code foi lido, mas o check-in não foi confirmado. Tente novamente.
              </Text>
              <View className="mt-6">
                <SystemButton title="Tentar novamente" iconLeft="refresh" onPress={handleRetry} />
              </View>
            </View>
          ) : null}

          {result && resultActionStatus === "success" ? (
            <View className="rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                <MaterialIcons name="check" size={26} color={colors.stateSuccess} />
              </View>
              <Text className="mt-5 font-bold text-2xl text-[#051223]">{successTitle}</Text>
              <Text className="mt-2 text-[#5E6A7A] leading-5">{successDescription}</Text>
              <View className="mt-6">
                <SystemButton
                  title="Ler outro codigo"
                  iconLeft="qr-code-scanner"
                  onPress={handleRetry}
                />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export { QrCodeScannerScreen };
