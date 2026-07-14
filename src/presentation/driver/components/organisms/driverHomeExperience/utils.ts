import type { TripEntity } from "@/core/entity/tripEntity";
import { TripRouteProgressService } from "@/core/service/tripRouteProgressService";
import {
  formatTripTime,
  getTripStatusLabel,
  isTripCancelled,
  isTripFinished,
  isTripInProgress,
  isTripNotStarted,
  isTripWaitingReturn,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import { colors } from "@/presentation/shared/styles/colors";
import type { DriverHomeMainState, DriverOperationStep, RouteContext } from "./types";

function getDriverMainState({
  canStartTrip,
  trip,
}: {
  readonly canStartTrip: boolean;
  readonly trip: TripEntity;
}): DriverHomeMainState {
  if (isTripCancelled(trip)) {
    return {
      accent: colors.stateError,
      border: "#FECACA",
      description: trip.reasonOfCancellation
        ? `Justificativa do motorista: ${trip.reasonOfCancellation}`
        : "A viagem foi cancelada antes de chegar ao destino.",
      eyebrow: "Operação",
      icon: "error-outline",
      iconBackground: "#FEE2E2",
      infoDescription:
        "A viagem foi cancelada antes do destino. Nenhuma ação operacional está disponível.",
      infoTitle: "Atenção",
      surface: "#FEF2F2",
      title: "Viagem cancelada",
    };
  }

  if (isTripFinished(trip)) {
    return {
      accent: colors.stateSuccess,
      border: "#BBF7D0",
      description: "A última operação vinculada foi finalizada.",
      eyebrow: "Operação concluída",
      icon: "check-circle",
      iconBackground: "#DCFCE7",
      infoDescription: "Nenhuma viagem está em andamento neste momento.",
      infoTitle: "Tudo certo por aqui",
      surface: "#F0FDF4",
      title: "Viagem finalizada",
    };
  }

  if (isTripInProgress(trip)) {
    return {
      accent: colors.primaryGlow,
      border: "#BFDBFE",
      description: "A operação está em andamento.",
      eyebrow: "Viagem em andamento",
      icon: "near-me",
      iconBackground: "#DBEAFE",
      infoDescription: "Mantenha navegação, QR Code e detalhes acessíveis durante a operação.",
      infoTitle: "Atenção",
      surface: "#F1F7FF",
      title: "Em operação",
    };
  }

  if (canStartTrip) {
    return {
      accent: colors.accentGlow,
      border: "#FED7AA",
      description: "A viagem está aguardando início.",
      eyebrow: "Sua próxima operação",
      icon: "play-arrow",
      iconBackground: "#FFF4DA",
      infoDescription: "A viagem está pronta para início conforme as permissões atuais.",
      infoTitle: "Antes de começar",
      surface: "#FFF7E8",
      title: isTripWaitingReturn(trip) ? "Retorno disponível" : "Pronto para começar",
    };
  }

  if (isTripNotStarted(trip)) {
    return {
      accent: colors.primaryGlow,
      border: "#BFDBFE",
      description: "A viagem ainda não foi iniciada.",
      eyebrow: "Próxima operação",
      icon: "schedule",
      iconBackground: "#DBEAFE",
      infoDescription: "Nenhuma ação operacional é necessária neste momento.",
      infoTitle: "Antes de começar",
      surface: "#F1F7FF",
      title: "Próxima viagem",
    };
  }

  return {
    accent: colors.primaryGlow,
    border: "#BFDBFE",
    description: "Consulte os detalhes para acompanhar o estado desta viagem.",
    eyebrow: "Operação",
    icon: "directions-bus",
    iconBackground: "#DBEAFE",
    infoDescription: "A Home mostra apenas ações compatíveis com o estado atual da viagem.",
    infoTitle: "O que observar",
    surface: "#F1F7FF",
    title: getTripStatusLabel(trip),
  };
}

function getDriverInfoDescription({
  activeTrip,
  hasStudentPresenceData,
  pendingStudents,
  stateDescription,
}: {
  readonly activeTrip: boolean;
  readonly hasStudentPresenceData: boolean;
  readonly pendingStudents: number;
  readonly stateDescription: string;
}): string {
  if (!activeTrip) {
    return stateDescription;
  }

  if (!hasStudentPresenceData) {
    return "A lista de alunos ainda não foi carregada para calcular pendências de check-in.";
  }

  if (pendingStudents === 0) {
    return "Todos os alunos listados possuem check-in confirmado ou não há pendências abertas.";
  }

  return `${pendingStudents} alunos ainda não possuem check-in confirmado.`;
}

function getDriverOperationSteps(trip: TripEntity): DriverOperationStep[] {
  if (isTripCancelled(trip)) {
    return [
      { label: "Viagem iniciada", state: "done" },
      { label: "Operação em andamento", state: "done" },
      { label: "Operação cancelada antes do destino", state: "cancelled" },
      { label: "Destino não concluído", state: "pending" },
    ];
  }

  if (isTripFinished(trip)) {
    return [
      { label: "Viagem iniciada", state: "done" },
      { label: "Operação em andamento", state: "done" },
      { label: "Viagem finalizada", state: "done" },
    ];
  }

  return [
    { label: "Viagem iniciada", state: "done" },
    { label: "Operação em andamento", state: "current" },
    { label: "Viagem finalizada", state: "pending" },
  ];
}

function getRouteContext(trip: TripEntity): RouteContext {
  const routeProgress = TripRouteProgressService.calculate(trip);
  const directionLabel = routeProgress.direction === "returning" ? "Volta" : "Ida";

  if (isTripCancelled(trip)) {
    return {
      description: `Operação interrompida no percurso de ${directionLabel.toLowerCase()}. Ida prevista às ${formatTripTime(
        trip.route.going,
      )} e volta prevista às ${formatTripTime(trip.route.returning)}.`,
      directionLabel,
    };
  }

  if (isTripFinished(trip)) {
    return {
      description: `Operação de ${directionLabel.toLowerCase()} encerrada. Horários cadastrados: ida ${formatTripTime(
        trip.route.going,
      )} e volta ${formatTripTime(trip.route.returning)}.`,
      directionLabel,
    };
  }

  if (isTripInProgress(trip)) {
    return {
      description: `Operação em percurso de ${directionLabel.toLowerCase()}. Horários cadastrados: ida ${formatTripTime(
        trip.route.going,
      )} e volta ${formatTripTime(trip.route.returning)}.`,
      directionLabel,
    };
  }

  return {
    description: `Operação em preparação. Ida cadastrada para ${formatTripTime(
      trip.route.going,
    )} e volta para ${formatTripTime(trip.route.returning)}.`,
    directionLabel,
  };
}

function getStepBackground(state: DriverOperationStep["state"]): string {
  if (state === "done") {
    return colors.stateSuccess;
  }

  if (state === "current") {
    return colors.primaryGlow;
  }

  if (state === "cancelled") {
    return colors.stateError;
  }

  return "#EEF2F7";
}

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Bom dia";
  }

  if (hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

export {
  getDriverInfoDescription,
  getDriverMainState,
  getDriverOperationSteps,
  getFirstName,
  getGreeting,
  getRouteContext,
  getStepBackground,
};
