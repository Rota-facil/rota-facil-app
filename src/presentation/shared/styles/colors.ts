export const colors = {
  primary: "#1E3A8A",
  primaryGlow: "#3B82F6",
  accent: "#F5A524",
  secondary: "#EEF2F7",
  stateSuccess: "#16A34A",
  stateWarning: "#F5A524",
  stateError: "#DC2626",
  stateInfo: "#3B82F6",
  background: "#FAFBFC",
  surface: "#FFFFFF",
  border: "#E5EAF0",
  muted: "#64748B",
  foreground: "#0F172A",
  disabled: "#F1F5F9",
  textDefault: "#051223",
  textSecondary: "#5E6A7A",
  blueAccent: "#043DBC",
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorKey];
