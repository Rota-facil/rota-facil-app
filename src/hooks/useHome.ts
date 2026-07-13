import { useCallback, useEffect, useMemo, useState } from "react";
import type { TripEntity, TripProgress } from "@/core/entity/tripEntity";
import type { UserRole } from "@/core/entity/userEntity";
import { QrCodeService } from "@/core/service/qrCodeService";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";
import { useNotifications } from "./useNotifications";
import { useTrips } from "./useTrips";
import { useUser } from "./useUser";

const HOME_NOTIFICATION_LIMIT = 3;

const ACTIVE_TRIP_PROGRESS: ReadonlySet<TripProgress> = new Set([
  "STARTED",
  "RETURN_STARTED",
  "INSTITUTION_ARRIVAL",
  "BOARD_POINT_ARRIVAL",
]);

function isActiveTrip(trip: TripEntity): boolean {
  const currentProgress = trip.tripStatus.at(-1)?.progress;

  return currentProgress !== undefined && ACTIVE_TRIP_PROGRESS.has(currentProgress);
}

/**
 * Compõe os dados remotos necessários às Homes sem expor DTOs ou regras visuais.
 * A viagem vigente é escolhida entre as viagens do usuário usando exclusivamente
 * o último TripProgress, conforme a regra de status já adotada pelo fluxo de viagens.
 */
function useHome(expectedRole: UserRole) {
  const { error: userError, isLoading: isUserLoading, loadUser, user } = useUser();
  const { error: tripsError, isLoading: isTripsLoading, loadMyTrips, myTrips } = useTrips();
  const {
    error: notificationsError,
    isLoading: isNotificationsLoading,
    loadNotifications,
    notifications,
  } = useNotifications();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [qrCodeError, setQrCodeError] = useState<string | null>(null);

  const currentTrip = useMemo(() => myTrips.find(isActiveTrip) ?? null, [myTrips]);

  const loadHome = useCallback(async () => {
    setHasLoaded(false);
    setQrCodeValue(null);
    setQrCodeError(null);

    const loadedUser = await loadUser();

    if (!loadedUser || loadedUser.role !== expectedRole) {
      setHasLoaded(true);
      return;
    }

    const notificationsRequest = loadNotifications({ page: 0, size: HOME_NOTIFICATION_LIMIT });
    const loadedTrips = await loadMyTrips();

    const loadedCurrentTrip = loadedTrips?.find(isActiveTrip) ?? null;

    if (expectedRole === "DRIVER" && loadedCurrentTrip) {
      try {
        setQrCodeValue(QrCodeService.createTripCheckInValue({ tripId: loadedCurrentTrip.id }));
      } catch (error: unknown) {
        setQrCodeError(getErrorMessage(error, "Não foi possível preparar o QR Code da viagem."));
        handleError(error);
      }
    }

    setHasLoaded(true);
    await notificationsRequest;
  }, [expectedRole, loadMyTrips, loadNotifications, loadUser]);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  return {
    currentTrip,
    error: userError ?? tripsError,
    expectedRole,
    hasLoaded,
    isLoading: isUserLoading || isTripsLoading,
    isNotificationsLoading,
    notifications,
    notificationsError,
    qrCodeError,
    qrCodeValue,
    reload: loadHome,
    user,
  };
}

export { useHome };
