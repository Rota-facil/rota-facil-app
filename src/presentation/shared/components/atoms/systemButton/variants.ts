import { colors } from "@/presentation/shared/styles/colors";

const SYSTEM_BUTTON_VARIANTS = {
  primary: {
    gradient: [colors.primary, colors.primaryGlow] as const,
    text: "#FFFFFF",
    icon: "#FFFFFF",
    shadow: colors.primaryGlow,
  },

  white: {
    gradient: ["#FFFFFF", "#F8FAFC"] as const,
    text: colors.foreground,
    icon: colors.primary,
    shadow: "#CBD5E1",
  },

  danger: {
    gradient: [colors.stateError, "#EF4444"] as const,
    text: "#FFFFFF",
    icon: "#FFFFFF",
    shadow: colors.stateError,
  },

  disabled: {
    gradient: ["#E2E8F0", "#CBD5E1"] as const,
    text: "#475569",
    icon: "#475569",
    shadow: "transparent",
  },
};

export { SYSTEM_BUTTON_VARIANTS };
