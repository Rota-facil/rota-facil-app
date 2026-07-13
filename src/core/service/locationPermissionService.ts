import * as Location from "expo-location";
import type {
  LocationPermissionState,
  LocationPermissionStatus,
} from "@/core/entity/userLocationEntity";
import { LocationTrackingError } from "@/errors/errors";

const LocationPermissionService = {
  async getPermissionState(): Promise<LocationPermissionState> {
    const [foregroundPermission, backgroundPermission, servicesEnabled] = await Promise.all([
      Location.getForegroundPermissionsAsync(),
      Location.getBackgroundPermissionsAsync(),
      Location.hasServicesEnabledAsync(),
    ]);

    return {
      background: toPermissionStatus(backgroundPermission),
      canAskBackground: backgroundPermission.canAskAgain,
      canAskForeground: foregroundPermission.canAskAgain,
      foreground: toPermissionStatus(foregroundPermission),
      servicesEnabled,
    };
  },

  async requestForegroundPermission(): Promise<LocationPermissionState> {
    await Location.requestForegroundPermissionsAsync();

    return this.getPermissionState();
  },

  async requestBackgroundPermission(): Promise<LocationPermissionState> {
    const foregroundPermission = await Location.getForegroundPermissionsAsync();

    if (!foregroundPermission.granted) {
      throw new LocationTrackingError(
        "PERMISSION_DENIED",
        "Permita a localização enquanto usa o app antes de solicitar o uso em segundo plano.",
      );
    }

    await Location.requestBackgroundPermissionsAsync();

    return this.getPermissionState();
  },

  async hasServicesEnabled(): Promise<boolean> {
    return Location.hasServicesEnabledAsync();
  },
};

function toPermissionStatus(
  permission: Location.LocationPermissionResponse,
): LocationPermissionStatus {
  if (permission.granted) {
    return "granted";
  }

  if (!permission.canAskAgain) {
    return "blocked";
  }

  if (permission.status === Location.PermissionStatus.UNDETERMINED) {
    return "undetermined";
  }

  return "denied";
}

export { LocationPermissionService };
