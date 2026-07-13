import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { SimpleTripUserEntity, TripEntity } from "@/core/entity/tripEntity";
import {
  formatTripTime,
  getProgressSummary,
  getTripStatusLabel,
  isTripCancelled,
  isTripFinished,
  isTripInProgress,
  isTripWaitingReturn,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import { colors } from "@/presentation/shared/styles/colors";
import {
  ActionErrorPanel,
  HomeContextAction,
  InfoPill,
  OperationJourneyPanel,
  SecondaryAction,
  ShortInfoPanel,
} from "./HomePrimitives";
import { QrUnavailableModal } from "./QrUnavailableModal";
import { TripRoutePreview } from "./TripRoutePreview";
import {
  getDriverInfoDescription,
  getDriverMainState,
  getDriverOperationSteps,
  getRouteContext,
} from "./utils";

interface DriverTripContextProps {
  readonly actionError: string | null;
  readonly canOpenNavigation: boolean;
  readonly canShowCheckInQrCode: boolean;
  readonly canStartTrip: boolean;
  readonly isActionLoading: boolean;
  readonly onOpenDetails: () => void;
  readonly onOpenNavigation: () => void;
  readonly onOpenQrCode: () => void;
  readonly onStartTrip: () => void;
  readonly students: SimpleTripUserEntity[];
  readonly trip: TripEntity;
}

function DriverTripContext({
  actionError,
  canOpenNavigation,
  canShowCheckInQrCode,
  canStartTrip,
  isActionLoading,
  onOpenDetails,
  onOpenNavigation,
  onOpenQrCode,
  onStartTrip,
  students,
  trip,
}: DriverTripContextProps) {
  const [isQrUnavailableModalVisible, setIsQrUnavailableModalVisible] = useState(false);
  const state = getDriverMainState({ canStartTrip, trip });
  const activeTrip = isTripInProgress(trip);
  const progressSummary = getProgressSummary(students, trip.students);
  const hasStudentPresenceData = students.length > 0;
  const routeContext = getRouteContext(trip);
  const pendingStudents = hasStudentPresenceData
    ? progressSummary.pending + progressSummary.absent
    : 0;

  return (
    <View className="gap-5">
      <View
        className="overflow-hidden rounded-[28px] border bg-white p-5 shadow-lg shadow-blue-100"
        style={{
          borderColor: state.border,
        }}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="font-bold text-[#64748B] text-xs uppercase">{state.eyebrow}</Text>
            <Text className="mt-2 font-bold text-2xl text-[#051223]" numberOfLines={2}>
              {state.title}
            </Text>
          </View>

          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: state.iconBackground }}
          >
            <MaterialIcons name={state.icon} size={26} color={state.accent} />
          </View>
        </View>

        <View className="mt-5 overflow-hidden rounded-[24px] bg-[#F8FAFC]">
          <TripRoutePreview accent={state.accent} isCancelled={isTripCancelled(trip)} />

          <View className="p-4 pt-3">
            <Text className="font-semibold text-[#051223] text-lg" numberOfLines={2}>
              {trip.route.name || trip.name}
            </Text>
            <Text className="mt-1 text-[#5E6A7A] text-sm" numberOfLines={1}>
              {trip.bus.plate ? `Veículo ${trip.bus.plate}` : "Veículo sem placa informada"}
            </Text>

            <View className="mt-4 flex-row flex-wrap gap-2">
              <InfoPill
                accent={colors.primaryGlow}
                icon="sync-alt"
                label={routeContext.directionLabel}
              />
              <InfoPill
                accent={colors.primaryGlow}
                icon="schedule"
                label={`Ida ${formatTripTime(trip.route.going)}`}
              />
              <InfoPill
                accent={colors.primaryGlow}
                icon="restore"
                label={`Volta ${formatTripTime(trip.route.returning)}`}
              />
              <InfoPill
                accent={colors.accentGlow}
                icon="groups"
                label={`${progressSummary.total} alunos`}
              />
              <InfoPill
                accent={state.accent}
                icon="directions-bus"
                label={getTripStatusLabel(trip)}
              />
            </View>
          </View>
        </View>

        {activeTrip && hasStudentPresenceData ? (
          <Text className="mt-5 font-bold text-3xl" style={{ color: state.accent }}>
            {progressSummary.checkedIn} de {progressSummary.total}
          </Text>
        ) : null}

        <Text className="mt-3 text-[#334155] text-base leading-6">
          {activeTrip && hasStudentPresenceData
            ? "alunos possuem check-in confirmado nesta operação."
            : state.description}
        </Text>
        <Text className="mt-3 text-[#5E6A7A] text-sm leading-5">{routeContext.description}</Text>

        <View className="mt-5 gap-3">
          {canStartTrip ? (
            <HomeContextAction
              accent={colors.accentGlow}
              title={isTripWaitingReturn(trip) ? "Iniciar retorno" : "Iniciar viagem"}
              iconLeft="play-arrow"
              loading={isActionLoading}
              onPress={onStartTrip}
            />
          ) : null}

          {canOpenNavigation ? (
            <HomeContextAction
              accent={colors.primaryGlow}
              title="Abrir navegação"
              iconLeft="near-me"
              disabled={isActionLoading}
              onPress={onOpenNavigation}
            />
          ) : null}

          {!canStartTrip && !canOpenNavigation ? (
            <HomeContextAction
              accent={state.accent}
              title={isTripFinished(trip) ? "Ver resumo" : "Ver detalhes"}
              iconLeft="fact-check"
              disabled={isActionLoading}
              onPress={onOpenDetails}
            />
          ) : null}
        </View>

        {activeTrip ? (
          <View className="mt-4 flex-row gap-3">
            {canShowCheckInQrCode ? (
              <SecondaryAction
                accent={colors.accentGlow}
                icon="qr-code-2"
                label="QR Code"
                onPress={onOpenQrCode}
              />
            ) : (
              <SecondaryAction
                accent={colors.muted}
                icon="qr-code-2"
                label="QR Code"
                onPress={() => setIsQrUnavailableModalVisible(true)}
              />
            )}
            <SecondaryAction
              accent={colors.primaryGlow}
              icon="fact-check"
              label="Detalhes"
              onPress={onOpenDetails}
            />
          </View>
        ) : canStartTrip ? (
          <Pressable
            accessibilityRole="button"
            onPress={onOpenDetails}
            className="mt-4 self-center rounded-full bg-white px-4 py-2 active:opacity-85"
          >
            <Text className="font-semibold text-[#0D6BEE] text-sm">Ver detalhes</Text>
          </Pressable>
        ) : null}
      </View>

      {actionError ? <ActionErrorPanel message={actionError} /> : null}

      {activeTrip || isTripCancelled(trip) ? (
        <OperationJourneyPanel steps={getDriverOperationSteps(trip)} />
      ) : null}

      <ShortInfoPanel
        title={state.infoTitle}
        accent={state.accent}
        icon={state.icon}
        description={getDriverInfoDescription({
          activeTrip,
          hasStudentPresenceData,
          pendingStudents,
          stateDescription: state.infoDescription,
        })}
      />

      <QrUnavailableModal
        visible={isQrUnavailableModalVisible}
        onClose={() => setIsQrUnavailableModalVisible(false)}
      />
    </View>
  );
}

export { DriverTripContext };
