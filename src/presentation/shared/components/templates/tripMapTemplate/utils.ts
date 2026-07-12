import type { TripEntity, TripLocationEntity, TripProgress } from "@/core/entity/tripEntity";

type TripMapContext = "student" | "driver";
type TripMapPointKind = "start" | "stop" | "institution" | "bus";
type TripMapSelectionSource = "active" | "last-accessed";

interface TripMapCoordinate {
  readonly latitude: number;
  readonly longitude: number;
}

interface TripMapPoint {
  readonly id: string;
  readonly kind: TripMapPointKind;
  readonly title: string;
  readonly description: string;
  readonly coordinate: TripMapCoordinate;
}

interface TripMapCamera {
  readonly coordinates: TripMapCoordinate;
  readonly zoom: number;
}

interface TripMapStatusStage {
  readonly label: string;
  readonly percentage: number;
  readonly stepLabel: string;
}

interface TripMapRouteFocus {
  readonly label: string;
  readonly value: string;
}

interface TripMapViewModel {
  readonly trip: TripEntity;
  readonly selectionSource: TripMapSelectionSource;
  readonly statusLabel: string;
  readonly statusStage: TripMapStatusStage;
  readonly routeFocus: TripMapRouteFocus | null;
  readonly camera: TripMapCamera | null;
  readonly points: TripMapPoint[];
  readonly routeCoordinates: TripMapCoordinate[];
  readonly routePolylineCoordinates: TripMapCoordinate[];
  readonly busCoordinate: TripMapCoordinate | null;
  readonly hasGeographicData: boolean;
  readonly hasRouteGeographicData: boolean;
  readonly hasBusLocation: boolean;
}

const progressLabels: Record<TripProgress, string> = {
  NOT_STARTED: "Aguardando",
  CANCELLED: "Cancelada",
  STARTED: "Em andamento",
  STARTED_FINISHED: "Aguardando retorno",
  RETURN_STARTED: "Retorno iniciado",
  RETURN_FINISHED: "Finalizada",
  INSTITUTION_ARRIVAL: "Na instituição",
  BOARD_POINT_ARRIVAL: "No ponto",
};

const statusStages: Record<TripProgress, TripMapStatusStage> = {
  NOT_STARTED: {
    label: "Viagem ainda não iniciada",
    percentage: 0,
    stepLabel: "Etapa 0 de 4",
  },
  CANCELLED: {
    label: "Viagem cancelada",
    percentage: 0,
    stepLabel: "Sem progresso",
  },
  STARTED: {
    label: "Ida em andamento",
    percentage: 25,
    stepLabel: "Etapa 1 de 4",
  },
  BOARD_POINT_ARRIVAL: {
    label: "Passando pelos pontos",
    percentage: 35,
    stepLabel: "Etapa 2 de 4",
  },
  INSTITUTION_ARRIVAL: {
    label: "Chegada à instituição",
    percentage: 50,
    stepLabel: "Etapa 2 de 4",
  },
  STARTED_FINISHED: {
    label: "Aguardando retorno",
    percentage: 50,
    stepLabel: "Etapa 2 de 4",
  },
  RETURN_STARTED: {
    label: "Retorno em andamento",
    percentage: 75,
    stepLabel: "Etapa 3 de 4",
  },
  RETURN_FINISHED: {
    label: "Percurso finalizado",
    percentage: 100,
    stepLabel: "Etapa 4 de 4",
  },
};

const activeProgresses: TripProgress[] = [
  "STARTED",
  "BOARD_POINT_ARRIVAL",
  "INSTITUTION_ARRIVAL",
  "RETURN_STARTED",
];

function getCurrentProgress(trip: TripEntity): TripProgress {
  return trip.tripStatus.at(-1)?.progress ?? "NOT_STARTED";
}

function isActiveTrip(trip: TripEntity): boolean {
  return activeProgresses.includes(getCurrentProgress(trip));
}

function isWaitingReturnTrip(trip: TripEntity): boolean {
  return getCurrentProgress(trip) === "STARTED_FINISHED";
}

function selectTripForMap(
  trips: TripEntity[],
  lastAccessedTripId: string | null,
): { trip: TripEntity; source: TripMapSelectionSource } | null {
  const activeTrip = trips.find(isActiveTrip);

  if (activeTrip) {
    return { trip: activeTrip, source: "active" };
  }

  const waitingReturnTrip = trips.find(isWaitingReturnTrip);

  if (waitingReturnTrip) {
    return { trip: waitingReturnTrip, source: "active" };
  }

  const lastAccessedTrip = lastAccessedTripId
    ? trips.find((trip) => trip.id === lastAccessedTripId)
    : undefined;

  if (lastAccessedTrip) {
    return { trip: lastAccessedTrip, source: "last-accessed" };
  }

  return null;
}

function hasValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
}

function getLocationCoordinate(location: TripLocationEntity): TripMapCoordinate | null {
  if (!hasValidCoordinate(location.latitude, location.longitude)) {
    return null;
  }

  return {
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

function getBusCoordinate(trip: TripEntity): TripMapCoordinate | null {
  if (!hasValidCoordinate(trip.latitude, trip.longitude)) {
    return null;
  }

  return {
    latitude: trip.latitude,
    longitude: trip.longitude,
  };
}

function getRouteCoordinates(trip: TripEntity): TripMapCoordinate[] {
  return [...trip.route.boardPoints, ...trip.route.institutions]
    .map(getLocationCoordinate)
    .filter((coordinate) => coordinate !== null);
}

function getRoutePoints(trip: TripEntity, busCoordinate: TripMapCoordinate | null): TripMapPoint[] {
  const boardPointMarkers = trip.route.boardPoints
    .map((boardPoint, index): TripMapPoint | null => {
      const coordinate = getLocationCoordinate(boardPoint);

      if (!coordinate) {
        return null;
      }

      return {
        id: `board-point-${boardPoint.id}`,
        kind: index === 0 ? "start" : "stop",
        title: index === 0 ? "Início do trajeto" : boardPoint.name,
        description: index === 0 ? boardPoint.name : "Ponto de parada",
        coordinate,
      };
    })
    .filter((point) => point !== null);

  const institutionMarkers = trip.route.institutions
    .map((institution): TripMapPoint | null => {
      const coordinate = getLocationCoordinate(institution);

      if (!coordinate) {
        return null;
      }

      return {
        id: `institution-${institution.id}`,
        kind: "institution",
        title: institution.name,
        description: "Instituição",
        coordinate,
      };
    })
    .filter((point) => point !== null);

  const busMarker: TripMapPoint[] = busCoordinate
    ? [
        {
          id: `bus-${trip.id}`,
          kind: "bus",
          title: "Ônibus",
          description: trip.bus.plate ? `Veículo ${trip.bus.plate}` : "Posição conhecida",
          coordinate: busCoordinate,
        },
      ]
    : [];

  return [...boardPointMarkers, ...institutionMarkers, ...busMarker];
}

function getCamera(points: TripMapCoordinate[]): TripMapCamera | null {
  if (points.length === 0) {
    return null;
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const latitudeDelta = maxLatitude - minLatitude;
  const longitudeDelta = maxLongitude - minLongitude;
  const largestDelta = Math.max(latitudeDelta, longitudeDelta);

  return {
    coordinates: {
      latitude: (minLatitude + maxLatitude) / 2,
      longitude: (minLongitude + maxLongitude) / 2,
    },
    zoom: getZoomForDelta(largestDelta),
  };
}

function getZoomForDelta(delta: number): number {
  if (delta > 1) {
    return 8;
  }

  if (delta > 0.25) {
    return 10;
  }

  if (delta > 0.08) {
    return 12;
  }

  if (delta > 0.02) {
    return 13;
  }

  return 15;
}

function formatTripTime(time: string): string {
  const [hours, minutes] = time.split(":");

  if (!hours || !minutes) {
    return time || "Não informado";
  }

  return `${hours}:${minutes}`;
}

function getTripTimeLabel(trip: TripEntity): string {
  const progress = getCurrentProgress(trip);

  if (progress === "RETURN_STARTED" || progress === "RETURN_FINISHED") {
    return `${formatTripTime(trip.route.returning)} - ${formatTripTime(trip.route.returnFinish)}`;
  }

  return `${formatTripTime(trip.route.going)} - ${formatTripTime(trip.route.goingFinish)}`;
}

function getRouteFocus(trip: TripEntity): TripMapRouteFocus | null {
  const progress = getCurrentProgress(trip);
  const firstBoardPoint = trip.route.boardPoints[0];
  const firstInstitution = trip.route.institutions[0];
  const lastBoardPoint = trip.route.boardPoints.at(-1);

  if (progress === "RETURN_STARTED" && firstBoardPoint) {
    return { label: "Retorno para", value: firstBoardPoint.name };
  }

  if (progress === "RETURN_FINISHED" && lastBoardPoint) {
    return { label: "Destino final", value: lastBoardPoint.name };
  }

  if ((progress === "INSTITUTION_ARRIVAL" || progress === "STARTED_FINISHED") && firstInstitution) {
    return { label: "Instituição", value: firstInstitution.name };
  }

  if (firstBoardPoint) {
    return { label: "Primeiro ponto", value: firstBoardPoint.name };
  }

  if (firstInstitution) {
    return { label: "Instituição", value: firstInstitution.name };
  }

  return null;
}

function getTripStatusLabel(trip: TripEntity): string {
  const progress = getCurrentProgress(trip);

  return progressLabels[progress] ?? trip.actualStatus;
}

function buildTripMapViewModel(params: {
  readonly trip: TripEntity;
  readonly selectionSource: TripMapSelectionSource;
  readonly routePolylineCoordinates?: TripMapCoordinate[];
}): TripMapViewModel {
  const busCoordinate = getBusCoordinate(params.trip);
  const routeCoordinates = getRouteCoordinates(params.trip);
  const routePolylineCoordinates =
    params.routePolylineCoordinates && params.routePolylineCoordinates.length > 1
      ? params.routePolylineCoordinates
      : routeCoordinates;
  const points = getRoutePoints(params.trip, busCoordinate);
  const camera = getCamera(busCoordinate ? [...routeCoordinates, busCoordinate] : routeCoordinates);
  const progress = getCurrentProgress(params.trip);
  const hasRouteGeographicData = routeCoordinates.length > 0;
  const hasBusLocation = busCoordinate !== null;

  return {
    trip: params.trip,
    selectionSource: params.selectionSource,
    statusLabel: getTripStatusLabel(params.trip),
    statusStage: statusStages[progress],
    routeFocus: getRouteFocus(params.trip),
    camera,
    points,
    routeCoordinates,
    routePolylineCoordinates,
    busCoordinate,
    hasGeographicData: hasRouteGeographicData || hasBusLocation,
    hasRouteGeographicData,
    hasBusLocation,
  };
}

function mergeTripRouteFallback(detailTrip: TripEntity, listTrip: TripEntity): TripEntity {
  const shouldUseListBoardPoints =
    detailTrip.route.boardPoints.length === 0 && listTrip.route.boardPoints.length > 0;
  const shouldUseListInstitutions =
    detailTrip.route.institutions.length === 0 && listTrip.route.institutions.length > 0;

  if (!shouldUseListBoardPoints && !shouldUseListInstitutions) {
    return detailTrip;
  }

  return {
    ...detailTrip,
    route: {
      ...detailTrip.route,
      boardPoints: shouldUseListBoardPoints
        ? listTrip.route.boardPoints
        : detailTrip.route.boardPoints,
      institutions: shouldUseListInstitutions
        ? listTrip.route.institutions
        : detailTrip.route.institutions,
    },
  };
}

export type {
  TripMapContext,
  TripMapCoordinate,
  TripMapPoint,
  TripMapPointKind,
  TripMapSelectionSource,
  TripMapViewModel,
};
export {
  buildTripMapViewModel,
  formatTripTime,
  getTripTimeLabel,
  hasValidCoordinate,
  mergeTripRouteFallback,
  selectTripForMap,
};
