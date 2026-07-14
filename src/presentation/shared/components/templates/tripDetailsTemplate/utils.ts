import type {
  SimpleTripUserEntity,
  TripEntity,
  TripPresence,
  TripProgress,
  TripShift,
} from "@/core/entity/tripEntity";

type TripDetailsContext = "student" | "driver";
type TripDetailsTab = "summary" | "students" | "route";

interface TripProgressSummary {
  readonly checkedIn: number;
  readonly pending: number;
  readonly absent: number;
  readonly total: number;
  readonly percentage: number;
}

interface TripDetailsPermissions {
  readonly canStartTrip: boolean;
  readonly canCancelTrip: boolean;
  readonly canJoinTrip: boolean;
  readonly canLeaveTrip: boolean;
  readonly canCheckIn: boolean;
  readonly canShowCheckInQrCode: boolean;
  readonly canOpenNavigation: boolean;
  readonly canRateDriver: boolean;
  readonly canRateStudents: boolean;
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

const shiftLabels: Record<TripShift, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  NIGHT: "Noite",
};

const presenceLabels: Record<TripPresence, string> = {
  CHECKIN: "Check-in",
  PENDING: "Pendente",
  ABSENT: "Ausente",
};

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function getCurrentProgress(trip: TripEntity): TripProgress {
  return trip.tripStatus.at(-1)?.progress ?? "NOT_STARTED";
}

function isTripNotStarted(trip: TripEntity): boolean {
  return getCurrentProgress(trip) === "NOT_STARTED";
}

function isTripWaitingReturn(trip: TripEntity): boolean {
  return getCurrentProgress(trip) === "STARTED_FINISHED";
}

function isTripCancelled(trip: TripEntity): boolean {
  return getCurrentProgress(trip) === "CANCELLED";
}

function isTripFinished(trip: TripEntity): boolean {
  return getCurrentProgress(trip) === "RETURN_FINISHED";
}

function isTripInProgress(trip: TripEntity): boolean {
  const progress = getCurrentProgress(trip);

  return (
    progress === "STARTED" ||
    progress === "RETURN_STARTED" ||
    progress === "INSTITUTION_ARRIVAL" ||
    progress === "BOARD_POINT_ARRIVAL"
  );
}

function getTripStatusLabel(trip: TripEntity): string {
  return progressLabels[getCurrentProgress(trip)] ?? (trip.actualStatus || "Status indisponível");
}

function getTripShiftLabel(shift: TripShift): string {
  return shiftLabels[shift];
}

function getTripPresenceLabel(presence: TripPresence): string {
  return presenceLabels[presence];
}

function formatTripTime(time: string): string {
  const [hours, minutes] = time.split(":");

  if (!hours || !minutes) {
    return time || "Não informado";
  }

  return `${hours}:${minutes}`;
}

function getPrimaryInstitutionName(trip: TripEntity): string {
  return trip.route.institutions[0]?.name ?? "Instituição não informada";
}

function getPrimaryBoardPointName(trip: TripEntity): string {
  return trip.route.boardPoints[0]?.name ?? "Ponto de embarque não informado";
}

function getStudentInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function getProgressSummary(
  students: SimpleTripUserEntity[],
  fallbackTotal: number,
): TripProgressSummary {
  const checkedIn = students.filter((student) => student.presence === "CHECKIN").length;
  const pending = students.filter((student) => student.presence === "PENDING").length;
  const absent = students.filter((student) => student.presence === "ABSENT").length;
  const total = students.length > 0 ? students.length : Math.max(0, fallbackTotal);
  const percentage = total === 0 ? 0 : clampPercentage((checkedIn / total) * 100);

  return {
    checkedIn,
    pending,
    absent,
    total,
    percentage,
  };
}

function getTripDetailsPermissions(params: {
  readonly context: TripDetailsContext;
  readonly trip: TripEntity;
  readonly isAssignedDriver?: boolean;
  readonly isStudentJoined?: boolean;
  readonly studentPresence?: TripPresence | null;
}): TripDetailsPermissions {
  const isDriver = params.context === "driver" && params.isAssignedDriver === true;
  const isStudent = params.context === "student";
  const isJoinedStudent = isStudent && params.isStudentJoined === true;
  const notStarted = isTripNotStarted(params.trip);
  const waitingReturn = isTripWaitingReturn(params.trip);
  const inProgress = isTripInProgress(params.trip);
  const finished = isTripFinished(params.trip);
  const cancelled = isTripCancelled(params.trip);

  return {
    canStartTrip: isDriver && (notStarted || waitingReturn),
    canCancelTrip: isDriver && (notStarted || inProgress || waitingReturn),
    canJoinTrip: isStudent && !params.isStudentJoined && notStarted && !cancelled,
    canLeaveTrip: isJoinedStudent && (notStarted || inProgress || waitingReturn),
    canCheckIn: isJoinedStudent && inProgress && params.studentPresence !== "CHECKIN" && !cancelled,
    canShowCheckInQrCode: isDriver && inProgress,
    canOpenNavigation: isDriver && inProgress,
    canRateDriver: isJoinedStudent && (finished || cancelled),
    canRateStudents: isDriver && finished,
  };
}

export type { TripDetailsContext, TripDetailsPermissions, TripDetailsTab, TripProgressSummary };
export {
  formatTripTime,
  getCurrentProgress,
  getPrimaryBoardPointName,
  getPrimaryInstitutionName,
  getProgressSummary,
  getStudentInitials,
  getTripDetailsPermissions,
  getTripPresenceLabel,
  getTripShiftLabel,
  getTripStatusLabel,
  isTripCancelled,
  isTripFinished,
  isTripInProgress,
  isTripNotStarted,
  isTripWaitingReturn,
};
