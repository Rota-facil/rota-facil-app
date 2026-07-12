/**
 * Configuração central de ambiente.
 */
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  osrmBaseUrl: process.env.EXPO_PUBLIC_OSRM_BASE_URL ?? "https://router.project-osrm.org",
} as const;
