import type { TripEntity, TripLocationEntity, TripProgress } from "@/core/entity/tripEntity";

type TripRouteDirection = "going" | "returning";
type TripRouteProgressPhase =
  | "not-started"
  | "going"
  | "waiting-return"
  | "returning"
  | "finished"
  | "cancelled";
type TripRouteProgressPointKind = "board-point" | "institution";
type TripRouteProgressPointStatus = "completed" | "current" | "pending";

interface TripRouteProgressPoint {
  readonly id: string;
  readonly kind: TripRouteProgressPointKind;
  readonly name: string;
  readonly order: number;
  readonly status: TripRouteProgressPointStatus;
}

interface TripRouteProgressSummary {
  readonly completedPoints: number;
  readonly currentProgress: TripProgress;
  readonly direction: TripRouteDirection;
  readonly phase: TripRouteProgressPhase;
  readonly percentage: number;
  readonly points: TripRouteProgressPoint[];
  readonly progressTotalPoints: number;
  readonly totalPoints: number;
}

const TripRouteProgressService = {
  calculate(trip: TripEntity): TripRouteProgressSummary {
    const currentProgress = getCurrentProgress(trip);
    const direction = getCurrentDirection(trip);
    const routePoints = getRoutePoints(trip, direction);
    const progressTotalPoints = getProgressTotalPoints(trip, direction);
    const completedPoints = getCompletedPoints(
      trip,
      currentProgress,
      direction,
      progressTotalPoints,
    );
    const completedRoutePoints = getCompletedRoutePoints(
      completedPoints,
      currentProgress,
      direction,
    );
    const currentPointIndex = Math.min(completedRoutePoints, Math.max(0, routePoints.length - 1));
    const percentage = getPercentage(completedPoints, progressTotalPoints, currentProgress);

    return {
      completedPoints,
      currentProgress,
      direction,
      phase: getProgressPhase(currentProgress, direction),
      percentage,
      points: routePoints.map((point, index) => ({
        ...point,
        status: getPointStatus(index, completedRoutePoints, currentPointIndex, currentProgress),
      })),
      progressTotalPoints,
      totalPoints: routePoints.length,
    };
  },
};

function getCurrentProgress(trip: TripEntity): TripProgress {
  return trip.tripStatus.at(-1)?.progress ?? "NOT_STARTED";
}

function getCurrentDirection(trip: TripEntity): TripRouteDirection {
  const currentProgress = getCurrentProgress(trip);

  if (currentProgress === "RETURN_STARTED" || currentProgress === "RETURN_FINISHED") {
    return "returning";
  }

  const returnStartedIndex = trip.tripStatus.findIndex(
    (status) => status.progress === "RETURN_STARTED",
  );

  if (returnStartedIndex === -1) {
    return "going";
  }

  const currentProgressIndex = Math.max(0, trip.tripStatus.length - 1);

  return currentProgressIndex > returnStartedIndex ? "returning" : "going";
}

function getRoutePoints(
  trip: TripEntity,
  direction: TripRouteDirection,
): Omit<TripRouteProgressPoint, "status">[] {
  const goingPoints = [
    ...trip.route.boardPoints.map((point) => toProgressPoint(point, "board-point")),
    ...trip.route.institutions.map((point) => toProgressPoint(point, "institution")),
  ];

  const returningPoints = [
    ...trip.route.institutions.map((point) => toProgressPoint(point, "institution")),
    ...[...trip.route.boardPoints].reverse().map((point) => toProgressPoint(point, "board-point")),
  ];

  return (direction === "returning" ? returningPoints : goingPoints).map((point, index) => ({
    ...point,
    order: index + 1,
  }));
}

function getProgressTotalPoints(trip: TripEntity, direction: TripRouteDirection): number {
  if (direction === "returning") {
    return trip.route.boardPoints.length;
  }

  return trip.route.boardPoints.length + trip.route.institutions.length;
}

function toProgressPoint(
  point: TripLocationEntity,
  kind: TripRouteProgressPointKind,
): Omit<TripRouteProgressPoint, "order" | "status"> {
  return {
    id: point.id,
    kind,
    name: point.name,
  };
}

function getCompletedPoints(
  trip: TripEntity,
  currentProgress: TripProgress,
  direction: TripRouteDirection,
  totalPoints: number,
): number {
  if (totalPoints === 0 || currentProgress === "NOT_STARTED" || currentProgress === "CANCELLED") {
    return 0;
  }

  if (currentProgress === "RETURN_FINISHED") {
    return totalPoints;
  }

  if (direction === "going") {
    if (currentProgress === "INSTITUTION_ARRIVAL" || currentProgress === "STARTED_FINISHED") {
      return totalPoints;
    }

    return Math.min(countProgressBeforeReturn(trip, "BOARD_POINT_ARRIVAL"), totalPoints);
  }

  if (currentProgress === "RETURN_STARTED") {
    return 0;
  }

  return Math.min(countProgressAfterReturnStart(trip, "BOARD_POINT_ARRIVAL"), totalPoints);
}

function getCompletedRoutePoints(
  completedPoints: number,
  currentProgress: TripProgress,
  direction: TripRouteDirection,
): number {
  if (currentProgress === "RETURN_FINISHED") {
    return Number.MAX_SAFE_INTEGER;
  }

  if (direction === "returning" && completedPoints > 0) {
    return completedPoints + 1;
  }

  return completedPoints;
}

function countProgressBeforeReturn(trip: TripEntity, progress: TripProgress): number {
  const returnStartedIndex = trip.tripStatus.findIndex(
    (status) => status.progress === "RETURN_STARTED",
  );
  const statuses =
    returnStartedIndex === -1 ? trip.tripStatus : trip.tripStatus.slice(0, returnStartedIndex);

  return statuses.filter((status) => status.progress === progress).length;
}

function countProgressAfterReturnStart(trip: TripEntity, progress: TripProgress): number {
  const returnStartedIndex = trip.tripStatus.findIndex(
    (status) => status.progress === "RETURN_STARTED",
  );

  if (returnStartedIndex === -1) {
    return 0;
  }

  return trip.tripStatus
    .slice(returnStartedIndex + 1)
    .filter((status) => status.progress === progress).length;
}

function getPercentage(
  completedPoints: number,
  totalPoints: number,
  currentProgress: TripProgress,
): number {
  if (currentProgress === "RETURN_FINISHED") {
    return 100;
  }

  if (totalPoints === 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((completedPoints / totalPoints) * 100)));
}

function getProgressPhase(
  currentProgress: TripProgress,
  direction: TripRouteDirection,
): TripRouteProgressPhase {
  if (currentProgress === "CANCELLED") {
    return "cancelled";
  }

  if (currentProgress === "NOT_STARTED") {
    return "not-started";
  }

  if (currentProgress === "STARTED_FINISHED") {
    return "waiting-return";
  }

  if (currentProgress === "RETURN_FINISHED") {
    return "finished";
  }

  return direction === "returning" ? "returning" : "going";
}

function getPointStatus(
  pointIndex: number,
  completedPoints: number,
  currentPointIndex: number,
  currentProgress: TripProgress,
): TripRouteProgressPointStatus {
  if (pointIndex < completedPoints) {
    return "completed";
  }

  if (
    pointIndex === currentPointIndex &&
    currentProgress !== "NOT_STARTED" &&
    currentProgress !== "CANCELLED" &&
    currentProgress !== "RETURN_FINISHED"
  ) {
    return "current";
  }

  return "pending";
}

export type {
  TripRouteDirection,
  TripRouteProgressPhase,
  TripRouteProgressPoint,
  TripRouteProgressPointStatus,
  TripRouteProgressSummary,
};
export { TripRouteProgressService };
