interface UserLocationEntity {
  readonly accuracy: number | null;
  readonly altitude: number | null;
  readonly heading: number | null;
  readonly latitude: number;
  readonly longitude: number;
  readonly speed: number | null;
  readonly timestamp: number;
}

interface LocationBatchEntity {
  readonly locations: UserLocationEntity[];
  readonly receivedAt: number;
}

type LocationPermissionStatus = "granted" | "denied" | "blocked" | "undetermined";

interface LocationPermissionState {
  readonly background: LocationPermissionStatus;
  readonly canAskBackground: boolean;
  readonly canAskForeground: boolean;
  readonly foreground: LocationPermissionStatus;
  readonly servicesEnabled: boolean;
}

type LocationTrackingStatus =
  | "idle"
  | "starting"
  | "tracking"
  | "stopping"
  | "blocked"
  | "unavailable"
  | "error";

interface LocationTrackingState {
  readonly isRegistered: boolean;
  readonly status: LocationTrackingStatus;
}

export type {
  LocationBatchEntity,
  LocationPermissionState,
  LocationPermissionStatus,
  LocationTrackingState,
  LocationTrackingStatus,
  UserLocationEntity,
};
