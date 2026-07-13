import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SimpleTripUserEntity } from "@/core/entity/tripEntity";
import { QrCodeService } from "@/core/service/qrCodeService";
import { useDriverTrips } from "@/hooks/useDriverTrips";
import { useTrips } from "@/hooks/useTrips";
import { useUser } from "@/hooks/useUser";
import {
  type CancelDriverTripFormSchema,
  cancelDriverTripSchema,
  type EvaluateTripStudentFormSchema,
  evaluateTripStudentSchema,
} from "@/presentation/driver/schemas/tripDetailsSchema";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import { QrCodeDisplay } from "@/presentation/shared/components/molecules/qrCodeDisplay";
import {
  type TripDetailsTab,
  TripDetailsTemplate,
} from "@/presentation/shared/components/templates/tripDetailsTemplate";
import {
  getTripDetailsPermissions,
  isTripWaitingReturn,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import {
  useKeyboardHeight,
  useKeyboardVisible,
} from "@/presentation/shared/hooks/useKeyboardVisible";
import { colors } from "@/presentation/shared/styles/colors";
import { MODAL_BOTTOM_SAFE_PADDING } from "@/presentation/shared/styles/layout";

interface DriverTripDetailsScreenProps {
  readonly tripId: string;
}

const TRIP_STUDENTS_REFRESH_INTERVAL_MS = 30_000;

function DriverActions({
  canCancelTrip,
  canOpenNavigation,
  canShowCheckInQrCode,
  canStartTrip,
  isLoading,
  startTripTitle,
  onCancelTrip,
  onOpenNavigation,
  onShowQrCode,
  onStartTrip,
}: {
  readonly canCancelTrip: boolean;
  readonly canOpenNavigation: boolean;
  readonly canShowCheckInQrCode: boolean;
  readonly canStartTrip: boolean;
  readonly isLoading: boolean;
  readonly startTripTitle: string;
  readonly onCancelTrip: () => void;
  readonly onOpenNavigation: () => void;
  readonly onShowQrCode: () => void;
  readonly onStartTrip: () => void;
}) {
  if (!canCancelTrip && !canOpenNavigation && !canShowCheckInQrCode && !canStartTrip) {
    return null;
  }

  return (
    <View className="gap-3 rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <Text className="text-[11px] font-bold uppercase text-[#64748B]">Ações do motorista</Text>

      {canStartTrip ? (
        <SystemButton
          title={startTripTitle}
          iconLeft="play-arrow"
          loading={isLoading}
          onPress={onStartTrip}
        />
      ) : null}

      {canOpenNavigation ? (
        <SystemButton
          title="Abrir navegação"
          iconLeft="near-me"
          disabled={isLoading}
          onPress={onOpenNavigation}
        />
      ) : null}

      {canShowCheckInQrCode ? (
        <SystemButton
          title="Exibir QR Code"
          iconLeft="qr-code-2"
          variant="white"
          disabled={isLoading}
          onPress={onShowQrCode}
        />
      ) : null}

      {canCancelTrip ? (
        <SystemButton
          title="Cancelar viagem"
          iconLeft="cancel"
          variant="danger"
          disabled={isLoading}
          onPress={onCancelTrip}
        />
      ) : null}
    </View>
  );
}

function DriverOperationAlert({ message }: { readonly message: string }) {
  return (
    <View className="flex-row items-start rounded-[24px] border border-[#FECACA] bg-[#FEF2F2] p-4 shadow-sm shadow-blue-100">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        <MaterialIcons name="error-outline" size={22} color={colors.stateError} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-[11px] font-bold uppercase text-[#B91C1C]">Viagem não iniciada</Text>
        <Text className="mt-1 text-sm text-[#7F1D1D] leading-5">{message}</Text>
      </View>
    </View>
  );
}

function CancelTripModal({
  error,
  loading,
  onClose,
  onSubmit,
  visible,
}: {
  readonly error: string | null;
  readonly loading: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: CancelDriverTripFormSchema) => void;
  readonly visible: boolean;
}) {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const isKeyboardVisible = keyboardHeight > 0;
  const form = useForm<CancelDriverTripFormSchema>({
    resolver: zodResolver(cancelDriverTripSchema),
    defaultValues: {
      reasonOfCancellation: "",
    },
  });

  useEffect(() => {
    if (!visible) {
      form.reset({ reasonOfCancellation: "" });
    }
  }, [form, visible]);

  const reason = form.watch("reasonOfCancellation");
  const bottomPadding = isKeyboardVisible
    ? Math.max(insets.bottom, MODAL_BOTTOM_SAFE_PADDING)
    : MODAL_BOTTOM_SAFE_PADDING;
  const bottomOffset = isKeyboardVisible ? keyboardHeight : 0;
  const cancelTripSheet = (
    <View
      className="max-h-[92%] rounded-t-[28px] bg-white px-6 pt-5"
      style={{ marginBottom: bottomOffset, paddingBottom: bottomPadding }}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="mb-5 flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <MaterialIcons name="warning-amber" size={26} color={colors.stateError} />
            </View>
            <Text className="font-bold text-xl text-[#051223]">Cancelar viagem</Text>
            <Text className="mt-2 text-sm text-[#5E6A7A] leading-5">
              Informe o motivo do cancelamento. Esta informação será enviada à prefeitura.
            </Text>
          </View>

          <Pressable
            disabled={loading}
            onPress={onClose}
            className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]"
          >
            <MaterialIcons name="close" size={22} color={colors.muted} />
          </Pressable>
        </View>

        <Controller
          control={form.control}
          name="reasonOfCancellation"
          render={({ field, fieldState }) => (
            <View>
              <Text className="mb-2 text-sm font-semibold text-[#5E6A7A]">MOTIVO *</Text>
              <TextInput
                editable={!loading}
                value={field.value}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                multiline
                textAlignVertical="top"
                maxLength={600}
                placeholder="Ex.: Problema mecânico no veículo, condições climáticas..."
                className="min-h-32 rounded-2xl border border-[#E5EAF0] bg-white px-4 py-3 text-[#051223]"
              />
              <Text className="mt-2 text-xs text-[#5E6A7A]">{reason.trim().length}/600</Text>
              {fieldState.error ? (
                <Text className="mt-2 text-sm text-[#DC2626]">{fieldState.error.message}</Text>
              ) : null}
            </View>
          )}
        />

        {error ? <Text className="mt-3 text-sm text-[#DC2626]">{error}</Text> : null}

        <View className="mt-5 flex-row gap-3">
          <View className="flex-1">
            <SystemButton
              title="Voltar"
              variant="white"
              disabled={loading}
              onPress={onClose}
              hideIcon
            />
          </View>
          <View className="flex-1">
            <SystemButton
              title="Confirmar"
              variant="danger"
              loading={loading}
              onPress={form.handleSubmit(onSubmit)}
              hideIcon
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/45">
        <Pressable className="flex-1" disabled={loading} onPress={onClose} />

        {cancelTripSheet}
      </View>
    </Modal>
  );
}

function CheckInQrCodeModal({
  onClose,
  tripId,
  visible,
}: {
  readonly onClose: () => void;
  readonly tripId: string;
  readonly visible: boolean;
}) {
  const insets = useSafeAreaInsets();
  const qrCodeValue = useMemo(() => QrCodeService.createTripCheckInValue({ tripId }), [tripId]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/45">
        <Pressable className="flex-1" onPress={onClose} />
        <View
          className="max-h-[88%] rounded-t-[28px] bg-[#F7FBFC] px-6 pt-5"
          style={{ paddingBottom: Math.max(insets.bottom, MODAL_BOTTOM_SAFE_PADDING) }}
        >
          <View className="mb-4 flex-row justify-end">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar QR Code"
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <MaterialIcons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <QrCodeDisplay
            value={qrCodeValue}
            title="QR Code de check-in"
            description="Apresente este código para os alunos cadastrados nesta viagem."
            label={tripId}
            helperText="O código identifica apenas esta viagem no Rota Fácil."
            accessibilityLabel="QR Code de check-in da viagem"
          />
        </View>
      </View>
    </Modal>
  );
}

function EvaluateStudentModal({
  error,
  loading,
  onClose,
  onSubmit,
  student,
}: {
  readonly error: string | null;
  readonly loading: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: EvaluateTripStudentFormSchema) => void;
  readonly student: SimpleTripUserEntity | null;
}) {
  const insets = useSafeAreaInsets();
  const isKeyboardVisible = useKeyboardVisible();
  const form = useForm<EvaluateTripStudentFormSchema>({
    resolver: zodResolver(evaluateTripStudentSchema),
    defaultValues: {
      feedback: "",
      note: 0,
    },
  });

  useEffect(() => {
    if (!student) {
      form.reset({ feedback: "", note: 0 });
    }
  }, [form, student]);

  const note = form.watch("note");

  return (
    <Modal visible={Boolean(student)} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        enabled={isKeyboardVisible}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-end bg-black/45">
          <Pressable className="flex-1" disabled={loading} onPress={onClose} />

          <ScrollView
            className="max-h-[92%] rounded-t-[28px] bg-white px-6 pt-5"
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom, MODAL_BOTTOM_SAFE_PADDING),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-5 flex-row items-start justify-between">
              <View className="mr-4 flex-1">
                <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-[#FFF4DA]">
                  <MaterialIcons name="star" size={28} color={colors.accentGlow} />
                </View>
                <Text className="font-bold text-xl text-[#051223]">Avaliar aluno</Text>
                <Text className="mt-2 font-semibold text-[#051223]">{student?.user.name}</Text>
                <Text className="mt-0.5 text-sm text-[#5E6A7A]">{student?.institutionName}</Text>
              </View>

              <Pressable
                disabled={loading}
                onPress={onClose}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]"
              >
                <MaterialIcons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>

            <Controller
              control={form.control}
              name="note"
              render={({ fieldState }) => (
                <View>
                  <Text className="mb-2 text-sm font-semibold text-[#5E6A7A]">
                    COMPORTAMENTO NA VIAGEM
                  </Text>
                  <View className="flex-row gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Pressable
                        key={value}
                        accessibilityRole="button"
                        accessibilityLabel={`Selecionar nota ${value}`}
                        disabled={loading}
                        onPress={() => form.setValue("note", value, { shouldValidate: true })}
                        className="h-11 w-11 items-center justify-center rounded-full bg-[#F8FAFC]"
                      >
                        <MaterialIcons
                          name={value <= note ? "star" : "star-border"}
                          size={28}
                          color={value <= note ? colors.accentGlow : colors.muted}
                        />
                      </Pressable>
                    ))}
                  </View>
                  {fieldState.error ? (
                    <Text className="mt-2 text-sm text-[#DC2626]">{fieldState.error.message}</Text>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="feedback"
              render={({ field, fieldState }) => (
                <View className="mt-4">
                  <Text className="mb-2 text-sm font-semibold text-[#5E6A7A]">
                    Comentário (opcional)
                  </Text>
                  <TextInput
                    editable={!loading}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    multiline
                    textAlignVertical="top"
                    maxLength={600}
                    placeholder="Registre uma observação sobre a viagem."
                    className="min-h-24 rounded-2xl border border-[#E5EAF0] bg-white px-4 py-3 text-[#051223]"
                  />
                  {fieldState.error ? (
                    <Text className="mt-2 text-sm text-[#DC2626]">{fieldState.error.message}</Text>
                  ) : null}
                </View>
              )}
            />

            {error ? <Text className="mt-3 text-sm text-[#DC2626]">{error}</Text> : null}

            <View className="mt-5">
              <SystemButton
                title="Enviar avaliação"
                iconLeft="star"
                loading={loading}
                onPress={form.handleSubmit(onSubmit)}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function DriverTripDetailsScreen({ tripId }: DriverTripDetailsScreenProps) {
  const { error: tripError, isLoading: isTripLoading, loadTrip, trip } = useTrips();
  const {
    cancelTrip,
    cancelTripError,
    evaluateStudentError,
    evaluateStudent,
    initTrip,
    initTripError,
    initTripReturn,
    isLoading: isDriverTripLoading,
    loadTripStudents,
    students,
  } = useDriverTrips();
  const { isLoading: isUserLoading, loadUser, user } = useUser();
  const [activeTab, setActiveTab] = useState<TripDetailsTab>("summary");
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isQrCodeModalVisible, setIsQrCodeModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<SimpleTripUserEntity | null>(null);
  const [hasLoadedDetails, setHasLoadedDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDetails = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "refresh") {
        setIsRefreshing(true);
      } else {
        setHasLoadedDetails(false);
      }

      try {
        await Promise.all([loadTrip(tripId), loadTripStudents(tripId), loadUser()]);
      } finally {
        setHasLoadedDetails(true);
        setIsRefreshing(false);
      }
    },
    [loadTrip, loadTripStudents, loadUser, tripId],
  );

  useFocusEffect(
    useCallback(() => {
      void loadDetails();

      const refreshIntervalId = setInterval(() => {
        void loadTripStudents(tripId, { silent: true });
      }, TRIP_STUDENTS_REFRESH_INTERVAL_MS);

      return () => {
        clearInterval(refreshIntervalId);
      };
    }, [loadDetails, loadTripStudents, tripId]),
  );

  const isAssignedDriver = Boolean(user && trip && user.id === trip.bus.driver.id);
  const permissions =
    hasLoadedDetails && trip
      ? getTripDetailsPermissions({
          context: "driver",
          isAssignedDriver,
          trip,
        })
      : null;
  const startTripTitle = trip && isTripWaitingReturn(trip) ? "Iniciar retorno" : "Iniciar viagem";
  const isLoading = (isTripLoading || isUserLoading) && !trip;
  const isActionLoading = isDriverTripLoading;

  const refreshAfterMutation = useCallback(async () => {
    await Promise.all([loadTrip(tripId), loadTripStudents(tripId)]);
  }, [loadTrip, loadTripStudents, tripId]);

  const handleStartTrip = useCallback(async () => {
    const startedTrip =
      trip && isTripWaitingReturn(trip) ? await initTripReturn(tripId) : await initTrip(tripId);

    if (startedTrip) {
      await refreshAfterMutation();
    }
  }, [initTrip, initTripReturn, refreshAfterMutation, trip, tripId]);

  const handleCancelTrip = useCallback(
    async (values: CancelDriverTripFormSchema) => {
      const cancelledTrip = await cancelTrip(tripId, {
        reasonOfCancellation: values.reasonOfCancellation.trim(),
      });

      if (cancelledTrip) {
        setIsCancelModalVisible(false);
        await refreshAfterMutation();
      }
    },
    [cancelTrip, refreshAfterMutation, tripId],
  );

  const handleEvaluateStudent = useCallback(
    async (values: EvaluateTripStudentFormSchema) => {
      if (!selectedStudent) {
        return;
      }

      const evaluation = await evaluateStudent(selectedStudent.user.id, {
        feedback: values.feedback?.trim() ?? "",
        note: values.note,
      });

      if (evaluation) {
        setSelectedStudent(null);
        await loadTripStudents(tripId);
      }
    },
    [evaluateStudent, loadTripStudents, selectedStudent, tripId],
  );

  const handleRefresh = useCallback(() => {
    void loadDetails("refresh");
  }, [loadDetails]);

  const handleRetry = useCallback(() => {
    void loadDetails();
  }, [loadDetails]);

  return (
    <>
      <TripDetailsTemplate
        trip={trip}
        students={students}
        context="driver"
        activeTab={activeTab}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        error={tripError}
        canEvaluateStudents={permissions?.canRateStudents}
        onBack={() => router.back()}
        onRefresh={handleRefresh}
        onRetry={handleRetry}
        onTabChange={setActiveTab}
        onEvaluateStudent={setSelectedStudent}
        roleActions={
          permissions ? (
            <View className="gap-3">
              {initTripError ? <DriverOperationAlert message={initTripError} /> : null}

              <DriverActions
                canCancelTrip={permissions.canCancelTrip}
                canOpenNavigation={permissions.canOpenNavigation}
                canShowCheckInQrCode={permissions.canShowCheckInQrCode}
                canStartTrip={permissions.canStartTrip}
                isLoading={isActionLoading}
                startTripTitle={startTripTitle}
                onCancelTrip={() => setIsCancelModalVisible(true)}
                onOpenNavigation={() => router.push("/(private)/driver/map")}
                onShowQrCode={() => setIsQrCodeModalVisible(true)}
                onStartTrip={handleStartTrip}
              />
            </View>
          ) : null
        }
      />

      <CancelTripModal
        visible={isCancelModalVisible}
        loading={isActionLoading}
        error={cancelTripError}
        onClose={() => setIsCancelModalVisible(false)}
        onSubmit={handleCancelTrip}
      />

      {trip ? (
        <CheckInQrCodeModal
          visible={isQrCodeModalVisible}
          tripId={trip.id}
          onClose={() => setIsQrCodeModalVisible(false)}
        />
      ) : null}

      <EvaluateStudentModal
        student={selectedStudent}
        loading={isActionLoading}
        error={evaluateStudentError}
        onClose={() => setSelectedStudent(null)}
        onSubmit={handleEvaluateStudent}
      />
    </>
  );
}

export default DriverTripDetailsScreen;
