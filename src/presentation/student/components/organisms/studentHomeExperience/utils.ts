import type { TripEntity, TripPresence } from "@/core/entity/tripEntity";
import { TripRouteProgressService } from "@/core/service/tripRouteProgressService";
import {
  formatTripTime,
  getCurrentProgress,
  getTripStatusLabel,
  isTripCancelled,
  isTripFinished,
  isTripInProgress,
} from "@/presentation/shared/components/templates/tripDetailsTemplate/utils";
import { colors } from "@/presentation/shared/styles/colors";
import type { RouteContext, StudentHomeMainState, StudentJourneyStep } from "./types";

function getStudentMainState(params: {
  readonly checkInConfirmed: boolean;
  readonly checkInPending: boolean;
  readonly presenceUnavailable: boolean;
  readonly trip: TripEntity;
  readonly tripCancelled: boolean;
  readonly tripFinished: boolean;
  readonly tripInProgress: boolean;
  readonly tripNotStarted: boolean;
}): StudentHomeMainState {
  if (params.tripCancelled) {
    return {
      accent: colors.stateError,
      border: "#FECACA",
      description: params.trip.reasonOfCancellation
        ? `Justificativa do motorista: ${params.trip.reasonOfCancellation}`
        : "A viagem foi cancelada antes de chegar ao destino.",
      eyebrow: "Seu transporte agora",
      icon: "error-outline",
      iconBackground: "#FEE2E2",
      infoDescription:
        "A viagem foi cancelada antes do destino. Nenhuma ação de embarque está disponível.",
      infoTitle: "Atenção",
      primaryAction: "details",
      surface: "#FEF2F2",
      title: "Viagem cancelada",
    };
  }

  if (params.tripFinished) {
    return {
      accent: colors.stateSuccess,
      border: "#BBF7D0",
      description: "A viagem vinculada já foi finalizada.",
      eyebrow: "Tudo certo por aqui",
      icon: "check-circle",
      iconBackground: "#DCFCE7",
      infoDescription: "Nenhuma ação é necessária neste momento.",
      infoTitle: "Tudo certo por aqui",
      primaryAction: "details",
      surface: "#F0FDF4",
      title: "Viagem finalizada",
    };
  }

  if (params.checkInConfirmed) {
    return {
      accent: colors.stateSuccess,
      border: "#BBF7D0",
      description: "Seu embarque está confirmado nesta viagem.",
      eyebrow: "Tudo certo por aqui",
      icon: "check-circle",
      iconBackground: "#DCFCE7",
      infoDescription: "Nenhuma ação de check-in é necessária neste momento.",
      infoTitle: "O que você precisa saber",
      primaryAction: "map",
      surface: "#F0FDF4",
      title: "Embarque confirmado",
    };
  }

  if (params.checkInPending) {
    return {
      accent: colors.accentGlow,
      border: "#FED7AA",
      description: "A viagem está em andamento e seu embarque ainda precisa ser confirmado.",
      eyebrow: "Seu transporte agora",
      icon: "qr-code-scanner",
      iconBackground: "#FFF4DA",
      infoDescription: "Confirme seu embarque pelo QR Code apresentado pelo motorista.",
      infoTitle: "O que você precisa saber",
      primaryAction: "check-in",
      surface: "#FFF7E8",
      title: "Check-in pendente",
    };
  }

  if (params.tripInProgress && params.presenceUnavailable) {
    return {
      accent: colors.primaryGlow,
      border: "#BFDBFE",
      description: "A viagem está em andamento, mas sua confirmação de embarque não foi carregada.",
      eyebrow: "Seu transporte agora",
      icon: "directions-bus",
      iconBackground: "#DBEAFE",
      infoDescription: "Abra os detalhes da viagem para consultar as ações disponíveis.",
      infoTitle: "O que você precisa saber",
      primaryAction: "details",
      surface: "#F1F7FF",
      title: "Viagem em andamento",
    };
  }

  if (params.tripNotStarted) {
    return {
      accent: colors.primaryGlow,
      border: "#BFDBFE",
      description: "A viagem ainda não foi iniciada.",
      eyebrow: "Seu próximo transporte",
      icon: "schedule",
      iconBackground: "#DBEAFE",
      infoDescription: "Nenhuma ação é necessária antes do início da viagem.",
      infoTitle: "O que você precisa saber",
      primaryAction: "details",
      surface: "#F1F7FF",
      title: "Próxima viagem",
    };
  }

  return {
    accent: colors.primaryGlow,
    border: "#BFDBFE",
    description: "Consulte o contexto e as ações disponíveis para esta viagem.",
    eyebrow: "Seu transporte",
    icon: "route",
    iconBackground: "#DBEAFE",
    infoDescription: "A Home mostra apenas ações compatíveis com os dados disponíveis.",
    infoTitle: "O que você precisa saber",
    primaryAction: "details",
    surface: "#F1F7FF",
    title: getTripStatusLabel(params.trip),
  };
}

function getStudentJourneySteps(
  trip: TripEntity,
  studentPresence: TripPresence | null,
): StudentJourneyStep[] {
  const progress = getCurrentProgress(trip);
  const checkInConfirmed = studentPresence === "CHECKIN";

  if (isTripCancelled(trip)) {
    return [
      { label: "Viagem iniciada", state: "done" },
      {
        label: checkInConfirmed ? "Embarque confirmado" : "Embarque não confirmado",
        state: checkInConfirmed ? "done" : "pending",
      },
      { label: "Viagem cancelada antes do destino", state: "cancelled" },
      { label: "Destino não concluído", state: "pending" },
    ];
  }

  if (isTripFinished(trip)) {
    return [
      { label: "Viagem iniciada", state: "done" },
      {
        label: checkInConfirmed ? "Embarque confirmado" : "Embarque não confirmado",
        state: "done",
      },
      { label: "Destino", state: "done" },
    ];
  }

  return [
    { label: "Viagem iniciada", state: "done" },
    {
      label: checkInConfirmed ? "Embarque confirmado" : "Aguardando seu embarque",
      state: checkInConfirmed ? "done" : "current",
    },
    {
      label: checkInConfirmed ? "Viagem em andamento" : "Check-in",
      state: checkInConfirmed ? "current" : "pending",
    },
    {
      label:
        progress === "INSTITUTION_ARRIVAL" || progress === "BOARD_POINT_ARRIVAL"
          ? "Chegada registrada"
          : "Destino",
      state: "pending",
    },
  ];
}

function getRouteContext(trip: TripEntity): RouteContext {
  const routeProgress = TripRouteProgressService.calculate(trip);
  const directionLabel = routeProgress.direction === "returning" ? "Volta" : "Ida";

  if (isTripCancelled(trip)) {
    return {
      description: `A viagem foi interrompida no percurso de ${directionLabel.toLowerCase()}. Ida prevista às ${formatTripTime(
        trip.route.going,
      )} e volta prevista às ${formatTripTime(trip.route.returning)}.`,
      directionLabel,
    };
  }

  if (isTripFinished(trip)) {
    return {
      description: `Percurso de ${directionLabel.toLowerCase()} encerrado. Horários cadastrados: ida ${formatTripTime(
        trip.route.going,
      )} e volta ${formatTripTime(trip.route.returning)}.`,
      directionLabel,
    };
  }

  if (isTripInProgress(trip)) {
    return {
      description: `A viagem está no percurso de ${directionLabel.toLowerCase()}. Horários cadastrados: ida ${formatTripTime(
        trip.route.going,
      )} e volta ${formatTripTime(trip.route.returning)}.`,
      directionLabel,
    };
  }

  return {
    description: `Viagem ainda em preparação. Ida cadastrada para ${formatTripTime(
      trip.route.going,
    )} e volta para ${formatTripTime(trip.route.returning)}.`,
    directionLabel,
  };
}

function getStepBackground(state: StudentJourneyStep["state"]): string {
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

function getFormattedDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date());
}

export {
  getFirstName,
  getFormattedDate,
  getGreeting,
  getRouteContext,
  getStepBackground,
  getStudentJourneySteps,
  getStudentMainState,
};
