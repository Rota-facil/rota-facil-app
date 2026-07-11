import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { QR_CODE_TYPES } from "@/core/entity/qrCodeEntity";
import type { TripLocationEntity } from "@/core/entity/tripEntity";
import { useDriverTrips } from "@/hooks/useDriverTrips";
import { useTrips } from "@/hooks/useTrips";
import { useUser } from "@/hooks/useUser";
import { SystemButton } from "@/presentation/shared/components/atoms/systemButton";
import {
  type TripDetailsTab,
  TripDetailsTemplate,
} from "@/presentation/shared/components/templates/tripDetailsTemplate";
import { getTripDetailsPermissions } from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import { colors } from "@/presentation/shared/styles/colors";
import {
  type JoinTripFormSchema,
  joinTripSchema,
} from "@/presentation/student/schemas/tripDetailsSchema";

interface StudentTripDetailsScreenProps {
  readonly tripId: string;
}

interface LocationSelectProps {
  readonly error?: string;
  readonly label: string;
  readonly locations: TripLocationEntity[];
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly value: string;
}

function StudentActions({
  canCheckIn,
  canJoinTrip,
  canLeaveTrip,
  isLoading,
  onCheckIn,
  onJoinTrip,
  onLeaveTrip,
}: {
  readonly canCheckIn: boolean;
  readonly canJoinTrip: boolean;
  readonly canLeaveTrip: boolean;
  readonly isLoading: boolean;
  readonly onCheckIn: () => void;
  readonly onJoinTrip: () => void;
  readonly onLeaveTrip: () => void;
}) {
  if (!canCheckIn && !canJoinTrip && !canLeaveTrip) {
    return null;
  }

  return (
    <View className="gap-3 rounded-[28px] bg-white p-5 shadow-sm shadow-blue-100">
      <Text className="text-[11px] font-bold uppercase text-[#64748B]">Ações do aluno</Text>

      {canJoinTrip ? (
        <SystemButton
          title="Entrar na viagem"
          iconLeft="person-add"
          loading={isLoading}
          onPress={onJoinTrip}
        />
      ) : null}

      {canCheckIn ? (
        <SystemButton
          title="Fazer check-in"
          iconLeft="qr-code-scanner"
          disabled={isLoading}
          onPress={onCheckIn}
        />
      ) : null}

      {canLeaveTrip ? (
        <SystemButton
          title="Cancelar participação"
          iconLeft="logout"
          variant="danger"
          disabled={isLoading}
          onPress={onLeaveTrip}
        />
      ) : null}
    </View>
  );
}

function LocationSelect({
  error,
  label,
  locations,
  onChange,
  placeholder,
  value,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLocation = locations.find((location) => location.id === value);

  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-[#5E6A7A]">{label}</Text>

      <Pressable
        accessibilityRole="button"
        disabled={locations.length === 0}
        onPress={() => setIsOpen(true)}
        className="h-14 flex-row items-center rounded-2xl border border-[#E5EAF0] bg-white px-4"
      >
        <MaterialIcons name="place" size={20} color={colors.muted} />
        <Text
          className="ml-3 flex-1 text-base"
          style={{ color: selectedLocation ? colors.textDefault : colors.muted }}
          numberOfLines={1}
        >
          {selectedLocation?.name ?? placeholder}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={22} color={colors.muted} />
      </Pressable>

      {error ? <Text className="mt-2 text-sm text-[#DC2626]">{error}</Text> : null}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setIsOpen(false)}>
          <Pressable className="max-h-[72%] rounded-t-3xl bg-white p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-bold text-lg text-[#051223]">{label}</Text>
                <Text className="mt-1 text-sm text-[#5E6A7A]">Selecione uma opção da viagem.</Text>
              </View>

              <Pressable
                onPress={() => setIsOpen(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]"
              >
                <MaterialIcons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>

            <FlatList
              data={locations}
              keyExtractor={(location) => location.id}
              ListEmptyComponent={
                <Text className="py-5 text-center text-[#5E6A7A]">Nenhuma opção disponível.</Text>
              }
              renderItem={({ item }) => {
                const isSelected = item.id === value;

                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.id);
                      setIsOpen(false);
                    }}
                    className="mb-3 min-h-16 flex-row items-center rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: isSelected ? colors.primaryGlow : colors.border,
                      backgroundColor: isSelected ? "#EFF6FF" : colors.surface,
                    }}
                  >
                    <View
                      className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: isSelected ? colors.primaryGlow : "#EEF2F7" }}
                    >
                      <MaterialIcons
                        name="place"
                        size={21}
                        color={isSelected ? "#FFFFFF" : colors.muted}
                      />
                    </View>

                    <Text
                      className="flex-1 font-semibold text-base text-[#051223]"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>

                    <View
                      className="ml-3 h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: isSelected ? colors.primaryGlow : "#F8FAFC" }}
                    >
                      <MaterialIcons
                        name={isSelected ? "check" : "chevron-right"}
                        size={20}
                        color={isSelected ? "#FFFFFF" : colors.muted}
                      />
                    </View>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function JoinTripModal({
  boardPoints,
  error,
  institutions,
  loading,
  onClose,
  onSubmit,
  visible,
}: {
  readonly boardPoints: TripLocationEntity[];
  readonly error: string | null;
  readonly institutions: TripLocationEntity[];
  readonly loading: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: JoinTripFormSchema) => void;
  readonly visible: boolean;
}) {
  const form = useForm<JoinTripFormSchema>({
    resolver: zodResolver(joinTripSchema),
    defaultValues: {
      boardPointId: "",
      institutionId: "",
    },
  });

  useEffect(() => {
    if (!visible) {
      form.reset({ boardPointId: "", institutionId: "" });
    }
  }, [form, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/45">
        <Pressable className="flex-1" disabled={loading} onPress={onClose} />

        <View className="rounded-t-[28px] bg-white px-6 pb-7 pt-5">
          <View className="mb-5 flex-row items-start justify-between">
            <View className="mr-4 flex-1">
              <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-[#EAF3FF]">
                <MaterialIcons name="person-add" size={26} color={colors.primaryGlow} />
              </View>
              <Text className="font-bold text-xl text-[#051223]">Entrar na viagem</Text>
              <Text className="mt-2 text-sm text-[#5E6A7A] leading-5">
                Selecione o ponto de embarque e a instituição de destino.
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

          <View className="gap-4">
            <Controller
              control={form.control}
              name="boardPointId"
              render={({ field, fieldState }) => (
                <LocationSelect
                  label="PONTO DE EMBARQUE"
                  placeholder="Selecione o ponto"
                  locations={boardPoints}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="institutionId"
              render={({ field, fieldState }) => (
                <LocationSelect
                  label="INSTITUIÇÃO"
                  placeholder="Selecione a instituição"
                  locations={institutions}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </View>

          {error ? <Text className="mt-3 text-sm text-[#DC2626]">{error}</Text> : null}

          <View className="mt-5">
            <SystemButton
              title="Finalizar entrada"
              iconLeft="check"
              loading={loading}
              onPress={form.handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function StudentTripDetailsScreen({ tripId }: StudentTripDetailsScreenProps) {
  const {
    error: tripError,
    exitTrip,
    isLoading: isTripLoading,
    joinTrip,
    loadTrip,
    trip,
  } = useTrips();
  const { isLoading: isStudentsLoading, loadTripStudents, students } = useDriverTrips();
  const { isLoading: isUserLoading, loadUser, user } = useUser();
  const [activeTab, setActiveTab] = useState<TripDetailsTab>("summary");
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const [hasLoadedDetails, setHasLoadedDetails] = useState(false);

  const loadDetails = useCallback(async () => {
    setHasLoadedDetails(false);

    try {
      await Promise.all([loadTrip(tripId), loadTripStudents(tripId), loadUser()]);
    } finally {
      setHasLoadedDetails(true);
    }
  }, [loadTrip, loadTripStudents, loadUser, tripId]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  const studentTripUser = user
    ? students.find((student) => student.user.id === user.id)
    : undefined;
  const permissions =
    hasLoadedDetails && trip && user
      ? getTripDetailsPermissions({
          context: "student",
          isStudentJoined: Boolean(studentTripUser),
          studentPresence: studentTripUser?.presence ?? null,
          trip,
        })
      : null;
  const isLoading = (isTripLoading || isUserLoading || isStudentsLoading) && !trip;
  const isActionLoading = isTripLoading;

  const refreshAfterMutation = useCallback(async () => {
    await Promise.all([loadTrip(tripId), loadTripStudents(tripId)]);
  }, [loadTrip, loadTripStudents, tripId]);

  const handleJoinTrip = useCallback(
    async (values: JoinTripFormSchema) => {
      const joinedTrip = await joinTrip(tripId, {
        boardPointId: values.boardPointId,
        going: true,
        institutionId: values.institutionId,
        returning: true,
      });

      if (joinedTrip) {
        setIsJoinModalVisible(false);
        await refreshAfterMutation();
      }
    },
    [joinTrip, refreshAfterMutation, tripId],
  );

  const handleLeaveTrip = useCallback(async () => {
    const didLeaveTrip = await exitTrip(tripId);

    if (didLeaveTrip) {
      await refreshAfterMutation();
    }
  }, [exitTrip, refreshAfterMutation, tripId]);

  const handleCheckIn = useCallback(() => {
    router.push({
      pathname: "/(private)/qr-code/scan",
      params: {
        description: "Leia o QR Code apresentado pelo motorista para confirmar sua presença.",
        expectedTripId: tripId,
        expectedType: QR_CODE_TYPES.TRIP_CHECK_IN,
        successDescription: "Seu check-in foi registrado nesta viagem.",
        successTitle: "Check-in realizado",
        title: "Check-in da viagem",
      },
    });
  }, [tripId]);

  return (
    <>
      <TripDetailsTemplate
        trip={trip}
        students={students}
        context="student"
        activeTab={activeTab}
        isLoading={isLoading}
        error={tripError}
        onBack={() => router.back()}
        onRetry={loadDetails}
        onTabChange={setActiveTab}
        roleActions={
          permissions ? (
            <StudentActions
              canCheckIn={permissions.canCheckIn}
              canJoinTrip={permissions.canJoinTrip}
              canLeaveTrip={permissions.canLeaveTrip}
              isLoading={isActionLoading}
              onCheckIn={handleCheckIn}
              onJoinTrip={() => setIsJoinModalVisible(true)}
              onLeaveTrip={handleLeaveTrip}
            />
          ) : null
        }
      />

      {trip ? (
        <JoinTripModal
          visible={isJoinModalVisible}
          boardPoints={trip.route.boardPoints}
          institutions={trip.route.institutions}
          loading={isActionLoading}
          error={tripError}
          onClose={() => setIsJoinModalVisible(false)}
          onSubmit={handleJoinTrip}
        />
      ) : null}
    </>
  );
}

export default StudentTripDetailsScreen;
