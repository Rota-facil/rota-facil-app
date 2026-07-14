import type { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type DriverOperationStepState = "cancelled" | "done" | "current" | "pending";
type DriverHomeIconName = ComponentProps<typeof MaterialIcons>["name"];

interface DriverOperationStep {
  readonly label: string;
  readonly state: DriverOperationStepState;
}

interface DriverHomeMainState {
  readonly accent: string;
  readonly border: string;
  readonly description: string;
  readonly eyebrow: string;
  readonly icon: DriverHomeIconName;
  readonly iconBackground: string;
  readonly infoDescription: string;
  readonly infoTitle: string;
  readonly surface: string;
  readonly title: string;
}

interface RouteContext {
  readonly description: string;
  readonly directionLabel: string;
}

export type {
  DriverHomeIconName,
  DriverHomeMainState,
  DriverOperationStep,
  DriverOperationStepState,
  RouteContext,
};
