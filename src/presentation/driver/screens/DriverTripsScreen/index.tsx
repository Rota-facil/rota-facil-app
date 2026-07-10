import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import type { TripEntity } from "@/core/entity/tripEntity";
import { useTrips } from "@/hooks/useTrips";
import { TripsPageTemplate } from "@/presentation/shared/components/organisms/tripsPageTemplate";

interface DriverTripsState {
  trips: TripEntity[];
  isRefreshing: boolean;
  hasLoaded: boolean;
}

const initialTripsState: DriverTripsState = {
  trips: [],
  isRefreshing: false,
  hasLoaded: false,
};

function DriverTripsScreen() {
  const router = useRouter();
  const { isLoading, error, loadMyTrips } = useTrips();
  const [tripsState, setTripsState] = useState<DriverTripsState>(initialTripsState);

  const loadTripsList = useCallback(async () => {
    setTripsState((currentState) => ({
      ...currentState,
      isRefreshing: currentState.trips.length > 0,
    }));

    const response = await loadMyTrips();

    if (response) {
      setTripsState({
        trips: response,
        isRefreshing: false,
        hasLoaded: true,
      });

      return;
    }

    setTripsState((currentState) => ({
      ...currentState,
      isRefreshing: false,
      hasLoaded: true,
    }));
  }, [loadMyTrips]);

  useEffect(() => {
    if (tripsState.hasLoaded || tripsState.isRefreshing) {
      return;
    }

    void loadTripsList();
  }, [loadTripsList, tripsState.hasLoaded, tripsState.isRefreshing]);

  const handleRefresh = useCallback(() => {
    void loadTripsList();
  }, [loadTripsList]);

  const handleRetry = useCallback(() => {
    setTripsState((currentState) => ({
      ...currentState,
      trips: [],
      hasLoaded: false,
    }));

    void loadTripsList();
  }, [loadTripsList]);

  const handleTripPress = useCallback(
    (tripId: string) => {
      router.push({
        pathname: "/(private)/driver/trips/[tripId]",
        params: { tripId },
      });
    },
    [router],
  );

  return (
    <TripsPageTemplate
      trips={tripsState.trips}
      context="driver"
      isInitialLoading={isLoading && tripsState.trips.length === 0}
      isRefreshing={tripsState.isRefreshing}
      isLoadingMore={false}
      hasReachedEnd={tripsState.hasLoaded}
      error={error}
      emptyTitle="Nenhuma viagem atribuída"
      emptyDescription="As viagens programadas para sua condução aparecerão aqui."
      onRefresh={handleRefresh}
      onLoadMore={() => undefined}
      onRetry={handleRetry}
      onTripPress={handleTripPress}
    />
  );
}

export default DriverTripsScreen;
