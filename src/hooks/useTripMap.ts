import { type MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import type { TripEntity } from "@/core/entity/tripEntity";
import { RoutingService } from "@/core/service/routingService";
import { STORAGE_KEYS, StorageService } from "@/core/service/storageService";
import { TripService } from "@/core/service/tripService";
import { BackgroundError, HttpServerError } from "@/errors/errors";
import { getErrorMessage } from "@/errors/getErrorMessage";
import { handleError } from "@/errors/handleError";
import {
  buildTripMapViewModel,
  mergeTripRouteFallback,
  selectTripForMap,
  type TripMapViewModel,
} from "@/presentation/shared/components/templates/tripMapTemplate/utils";

interface UseTripMapState {
  readonly viewModel: TripMapViewModel | null;
  readonly isLoading: boolean;
  readonly isRefreshing: boolean;
  readonly hasLoaded: boolean;
  readonly error: string | null;
}

const initialState: UseTripMapState = {
  viewModel: null,
  isLoading: false,
  isRefreshing: false,
  hasLoaded: false,
  error: null,
};

const TRIP_MAP_POLLING_INTERVAL_MS = 30_000;
type TripMapLoadMode = "initial" | "refresh";
interface RoutePolylineCache {
  readonly key: string;
  readonly coordinates: TripMapViewModel["routePolylineCoordinates"];
}
interface SelectedTripCache {
  readonly selectionSource: TripMapViewModel["selectionSource"];
  readonly tripId: string;
}

/**
 * Compõe a viagem que deve alimentar o mapa de acompanhamento.
 * A regra prioriza viagens em andamento do usuário autenticado e só usa a última
 * viagem acessada quando ela ainda aparece em `my-trips`.
 */
function useTripMap() {
  const [state, setState] = useState<UseTripMapState>(initialState);
  const isRequestInFlightRef = useRef(false);
  const routePolylineCacheRef = useRef<RoutePolylineCache | null>(null);
  const selectedTripCacheRef = useRef<SelectedTripCache | null>(null);

  const setTripMapViewModel = useCallback(
    async (params: {
      readonly selectedTripSource: TripMapViewModel["selectionSource"];
      readonly trip: TripEntity;
    }) => {
      const fallbackViewModel = buildTripMapViewModel({
        selectionSource: params.selectedTripSource,
        trip: params.trip,
      });
      const routePolylineCoordinates = await calculateRoutePolylineCoordinates(
        fallbackViewModel.routeCoordinates,
        routePolylineCacheRef,
      );

      setState({
        viewModel: buildTripMapViewModel({
          routePolylineCoordinates,
          selectionSource: params.selectedTripSource,
          trip: params.trip,
        }),
        isLoading: false,
        isRefreshing: false,
        hasLoaded: true,
        error: null,
      });
    },
    [],
  );

  const loadTripMap = useCallback(
    async (mode: TripMapLoadMode = "initial") => {
      if (isRequestInFlightRef.current) {
        return;
      }

      isRequestInFlightRef.current = true;

      setState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: mode === "initial",
        isRefreshing: mode === "refresh",
      }));

      try {
        const userTrips = await TripService.getMyTrips();
        const lastAccessedTripId = await getLastAccessedTripId();
        const selectedTrip = selectTripForMap(userTrips, lastAccessedTripId);

        if (!selectedTrip) {
          setState({
            viewModel: null,
            isLoading: false,
            isRefreshing: false,
            hasLoaded: true,
            error: null,
          });

          return;
        }

        const tripDetails = await TripService.getTrip(selectedTrip.trip.id);
        const trip = mergeTripRouteFallback(tripDetails, selectedTrip.trip);

        if (lastAccessedTripId !== trip.id) {
          await saveLastAccessedTripId(trip.id);
        }

        selectedTripCacheRef.current = {
          selectionSource: selectedTrip.source,
          tripId: trip.id,
        };

        await setTripMapViewModel({
          selectedTripSource: selectedTrip.source,
          trip,
        });
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(
          error,
          "Não foi possível carregar o acompanhamento da viagem.",
        );

        setState((currentState) => ({
          ...currentState,
          isLoading: false,
          isRefreshing: false,
          hasLoaded: true,
          error: errorMessage,
        }));
        handleError(error);
      } finally {
        isRequestInFlightRef.current = false;
      }
    },
    [setTripMapViewModel],
  );

  const pollSelectedTrip = useCallback(async () => {
    if (isRequestInFlightRef.current) {
      return;
    }

    const selectedTripCache = selectedTripCacheRef.current;

    if (!selectedTripCache) {
      return;
    }

    isRequestInFlightRef.current = true;

    try {
      const trip = await TripService.getTrip(selectedTripCache.tripId);

      setState((currentState) => {
        if (!currentState.viewModel) {
          return currentState;
        }

        const updatedTrip = {
          ...currentState.viewModel.trip,
          latitude: trip.latitude,
          longitude: trip.longitude,
        };

        return {
          ...currentState,
          viewModel: buildTripMapViewModel({
            routePolylineCoordinates: currentState.viewModel.routePolylineCoordinates,
            selectionSource: selectedTripCache.selectionSource,
            trip: updatedTrip,
          }),
        };
      });
    } catch (error: unknown) {
      handleBackgroundTripMapError(error);
    } finally {
      isRequestInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    void loadTripMap();

    const pollingIntervalId = setInterval(() => {
      void pollSelectedTrip();
    }, TRIP_MAP_POLLING_INTERVAL_MS);

    return () => {
      clearInterval(pollingIntervalId);
    };
  }, [loadTripMap, pollSelectedTrip]);

  const refreshTripMap = useCallback(() => {
    void loadTripMap("refresh");
  }, [loadTripMap]);

  return {
    ...state,
    refreshTripMap,
  };
}

async function calculateRoutePolylineCoordinates(
  routeCoordinates: TripMapViewModel["routeCoordinates"],
  routePolylineCacheRef: MutableRefObject<RoutePolylineCache | null>,
): Promise<TripMapViewModel["routePolylineCoordinates"] | undefined> {
  const routeCoordinatesKey = getRouteCoordinatesKey(routeCoordinates);

  if (routePolylineCacheRef.current?.key === routeCoordinatesKey) {
    return routePolylineCacheRef.current.coordinates;
  }

  try {
    const routeGeometry = await RoutingService.calculateRoute(routeCoordinates);

    if (routeGeometry) {
      routePolylineCacheRef.current = {
        key: routeCoordinatesKey,
        coordinates: routeGeometry.coordinates,
      };
    }

    return routeGeometry?.coordinates;
  } catch (error: unknown) {
    handleError(
      new BackgroundError(
        getErrorMessage(error, "Não foi possível calcular a rota viária da viagem."),
      ),
    );
    return undefined;
  }
}

function getRouteCoordinatesKey(routeCoordinates: TripMapViewModel["routeCoordinates"]): string {
  return routeCoordinates
    .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
    .join(";");
}

function handleBackgroundTripMapError(error: unknown): void {
  if (error instanceof HttpServerError && error.status === 401 && error.shouldExpireSession) {
    handleError(error);
    return;
  }

  handleError(
    new BackgroundError(
      getErrorMessage(
        error,
        "Não foi possível atualizar a localização da viagem em segundo plano.",
      ),
    ),
  );
}

async function getLastAccessedTripId(): Promise<string | null> {
  try {
    return await StorageService.get<string>(STORAGE_KEYS.LAST_ACCESSED_TRIP_ID);
  } catch (error: unknown) {
    handleError(error);
    return null;
  }
}

async function saveLastAccessedTripId(tripId: string): Promise<void> {
  try {
    await StorageService.save<string>(STORAGE_KEYS.LAST_ACCESSED_TRIP_ID, tripId);
  } catch (error: unknown) {
    handleError(error);
  }
}

export { useTripMap };
