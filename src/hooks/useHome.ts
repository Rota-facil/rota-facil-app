import { useCallback, useEffect, useMemo, useState } from "react";
import type { TripEntity, TripProgress } from "@/core/entity/tripEntity";
import type { UserRole } from "@/core/entity/userEntity";
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

function selectHomeTrip(trips: TripEntity[]): TripEntity | null {
  return trips.find(isActiveTrip) ?? trips[0] ?? null;
}

/**
 * Compõe os dados remotos necessários às Homes sem expor DTOs ou regras visuais.
 * A Home prioriza a viagem vigente, mas mantém a viagem vinculada disponível
 * para que aluno e motorista tenham contexto antes do início da rota.
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentTrip = useMemo(() => selectHomeTrip(myTrips), [myTrips]);

  const loadHome = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "refresh") {
        setIsRefreshing(true);
      } else {
        setHasLoaded(false);
      }

      try {
        const loadedUser = await loadUser();

        if (!loadedUser || loadedUser.role !== expectedRole) {
          return;
        }

        const notificationsRequest = loadNotifications({ page: 0, size: HOME_NOTIFICATION_LIMIT });
        await loadMyTrips();

        await notificationsRequest;
      } finally {
        setHasLoaded(true);
        setIsRefreshing(false);
      }
    },
    [expectedRole, loadMyTrips, loadNotifications, loadUser],
  );

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
    isRefreshing,
    notifications,
    notificationsError,
    reload: () => loadHome("refresh"),
    user,
  };
}

export { useHome };
