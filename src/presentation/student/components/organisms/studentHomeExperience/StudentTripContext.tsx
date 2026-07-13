import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { TripEntity, TripPresence } from "@/core/entity/tripEntity";
import {
  formatTripTime,
  getPrimaryInstitutionName,
  getTripStatusLabel,
  isTripCancelled,
  isTripFinished,
  isTripInProgress,
  isTripNotStarted,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import { colors } from "@/presentation/shared/styles/colors";
import { HomeContextAction, InfoPill, JourneyPanel, ShortInfoPanel } from "./HomePrimitives";
import { TripRoutePreview } from "./TripRoutePreview";
import { getRouteContext, getStudentJourneySteps, getStudentMainState } from "./utils";

interface StudentTripContextProps {
  readonly isPresenceLoading: boolean;
  readonly onOpenCheckIn: () => void;
  readonly onOpenMap: () => void;
  readonly onOpenTripDetails: () => void;
  readonly studentPresence: TripPresence | null;
  readonly trip: TripEntity;
}

function StudentTripContext({
  isPresenceLoading,
  onOpenCheckIn,
  onOpenMap,
  onOpenTripDetails,
  studentPresence,
  trip,
}: StudentTripContextProps) {
  const destination = getPrimaryInstitutionName(trip);
  const tripInProgress = isTripInProgress(trip);
  const tripNotStarted = isTripNotStarted(trip);
  const tripFinished = isTripFinished(trip);
  const tripCancelled = isTripCancelled(trip);
  const routeContext = getRouteContext(trip);
  const checkInConfirmed = studentPresence === "CHECKIN";
  const checkInPending = tripInProgress && studentPresence !== null && !checkInConfirmed;
  const presenceUnavailable = tripInProgress && studentPresence === null && !isPresenceLoading;
  const mainState = getStudentMainState({
    checkInConfirmed,
    checkInPending,
    presenceUnavailable,
    trip,
    tripCancelled,
    tripFinished,
    tripInProgress,
    tripNotStarted,
  });

  return (
    <View className="gap-5">
      <View
        className="overflow-hidden rounded-[28px] border bg-white p-5 shadow-lg shadow-blue-100"
        style={{
          borderColor: mainState.border,
        }}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="font-bold text-[#64748B] text-xs uppercase">{mainState.eyebrow}</Text>
            <Text className="mt-2 font-bold text-2xl text-[#051223]" numberOfLines={2}>
              {mainState.title}
            </Text>
          </View>

          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: mainState.iconBackground }}
          >
            <MaterialIcons name={mainState.icon} size={26} color={mainState.accent} />
          </View>
        </View>

        <View className="mt-5 overflow-hidden rounded-[24px] bg-[#F8FAFC]">
          <TripRoutePreview accent={mainState.accent} isCancelled={tripCancelled} />

          <View className="p-4 pt-3">
            <Text className="font-semibold text-[#051223] text-lg" numberOfLines={2}>
              {trip.route.name || trip.name}
            </Text>
            <Text className="mt-1 text-[#5E6A7A] text-sm" numberOfLines={1}>
              {destination}
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
                accent={mainState.accent}
                icon="directions-bus"
                label={getTripStatusLabel(trip)}
              />
            </View>
          </View>
        </View>

        <Text className="mt-5 text-[#334155] text-base leading-6">{mainState.description}</Text>
        <Text className="mt-3 text-[#5E6A7A] text-sm leading-5">{routeContext.description}</Text>

        <View className="mt-5 gap-3">
          {mainState.primaryAction === "check-in" ? (
            <HomeContextAction
              accent={colors.accentGlow}
              title="Realizar check-in"
              iconLeft="qr-code-scanner"
              onPress={onOpenCheckIn}
            />
          ) : null}

          {mainState.primaryAction === "map" ? (
            <HomeContextAction
              accent={colors.primaryGlow}
              title="Acompanhar viagem"
              iconLeft="location-on"
              onPress={onOpenMap}
            />
          ) : null}

          {mainState.primaryAction === "details" ? (
            <HomeContextAction
              accent={mainState.accent}
              title={tripNotStarted ? "Ver viagem" : "Ver detalhes"}
              iconLeft="directions-bus"
              onPress={onOpenTripDetails}
            />
          ) : null}
        </View>

        {tripInProgress && !checkInPending ? (
          <Pressable
            accessibilityRole="button"
            onPress={onOpenTripDetails}
            className="mt-4 self-center rounded-full bg-white px-4 py-2 active:opacity-85"
          >
            <Text className="font-semibold text-[#0D6BEE] text-sm">Ver detalhes</Text>
          </Pressable>
        ) : null}
      </View>

      {tripInProgress || checkInConfirmed || tripCancelled ? (
        <JourneyPanel steps={getStudentJourneySteps(trip, studentPresence)} title="Sua jornada" />
      ) : null}

      <ShortInfoPanel
        title={mainState.infoTitle}
        accent={mainState.accent}
        icon={mainState.icon}
        description={
          isPresenceLoading && tripInProgress
            ? "Atualizando sua confirmação de embarque."
            : mainState.infoDescription
        }
      />
    </View>
  );
}

export { StudentTripContext };
