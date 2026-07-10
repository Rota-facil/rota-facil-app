import type { TripEntity, TripProgress, TripShift } from "@/core/entity/tripEntity";

const progressLabels: Record<TripProgress, string> = {
  NOT_STARTED: "Aguardando",
  CANCELLED: "Cancelada",
  STARTED: "Em andamento",
  STARTED_FINISHED: "Ida finalizada",
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

function getTripShiftLabel(shift: TripShift): string {
  return shiftLabels[shift];
}

function getTripStatusLabel(trip: TripEntity): string {
  const lastStatus = trip.tripStatus.at(-1);

  if (lastStatus) {
    return progressLabels[lastStatus.progress];
  }

  return trip.actualStatus || "Status indisponível";
}

function getStatusColor(trip: TripEntity): { background: string; text: string; dot: string } {
  const lastStatus = trip.tripStatus.at(-1);

  if (lastStatus?.progress === "CANCELLED") {
    return {
      background: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500",
    };
  }

  if (lastStatus?.progress === "RETURN_FINISHED" || lastStatus?.progress === "STARTED_FINISHED") {
    return {
      background: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    };
  }

  return {
    background: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  };
}

function getPrimaryInstitutionName(trip: TripEntity): string {
  return trip.route.institutions[0]?.name ?? "Instituição não informada";
}

function getPrimaryBoardPointName(trip: TripEntity): string {
  return trip.route.boardPoints[0]?.name ?? "Ponto de embarque não informado";
}

function formatTripTime(time: string): string {
  const [hours, minutes] = time.split(":");

  if (!hours || !minutes) {
    return time;
  }

  return `${hours}:${minutes}`;
}

export {
  formatTripTime,
  getPrimaryBoardPointName,
  getPrimaryInstitutionName,
  getStatusColor,
  getTripShiftLabel,
  getTripStatusLabel,
};
