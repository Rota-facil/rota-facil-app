import type { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type StudentJourneyStepState = "cancelled" | "done" | "current" | "pending";
type StudentPrimaryAction = "check-in" | "details" | "map";
type StudentHomeIconName = ComponentProps<typeof MaterialIcons>["name"];

interface StudentJourneyStep {
  readonly label: string;
  readonly state: StudentJourneyStepState;
}

interface StudentHomeMainState {
  readonly accent: string;
  readonly border: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly icon: StudentHomeIconName;
  readonly iconBackground: string;
  readonly infoDescription: string;
  readonly infoTitle: string;
  readonly primaryAction: StudentPrimaryAction;
  readonly surface: string;
  readonly title: string;
}

interface RouteContext {
  readonly description: string;
  readonly directionLabel: string;
}

export type {
  RouteContext,
  StudentHomeIconName,
  StudentHomeMainState,
  StudentJourneyStep,
  StudentJourneyStepState,
  StudentPrimaryAction,
};
