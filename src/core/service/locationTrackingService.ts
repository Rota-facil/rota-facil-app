import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import type { LocationTrackingState } from "@/core/entity/userLocationEntity";
import { userLocationMapper } from "@/core/mappers/userLocationMapper";
import { LocationTrackingError } from "@/errors/errors";
import { LocationPermissionService } from "./locationPermissionService";
import {
  DEFAULT_LOCATION_TRACKING_OPTIONS,
  LOCATION_TRACKING_TASK_NAME,
} from "./locationTaskConfig";

/**
 * The OS can suspend background execution and forced app termination can stop tracking. This service
 * controls registration state; it does not guarantee uninterrupted execution on every device.
 */
const LocationTrackingService = {
  async getStatus(): Promise<LocationTrackingState> {
    try {
      const isAvailable = await TaskManager.isAvailableAsync();

      if (!isAvailable) {
        return { isRegistered: false, status: "unavailable" };
      }

      const isRegistered = await this.isRegistered();

      return {
        isRegistered,
        status: isRegistered ? "tracking" : "idle",
      };
    } catch {
      return { isRegistered: false, status: "error" };
    }
  },

  async isRegistered(): Promise<boolean> {
    const { hasStartedLocationUpdates, isTaskRegistered } = await getLocationRegistrationState();

    return isTaskRegistered || hasStartedLocationUpdates;
  },

  async start(): Promise<LocationTrackingState> {
    const isAvailable = await TaskManager.isAvailableAsync();

    if (!isAvailable) {
      return { isRegistered: false, status: "unavailable" };
    }

    const currentState = await this.getStatus();

    if (currentState.isRegistered) {
      return currentState;
    }

    const permissionState = await LocationPermissionService.getPermissionState();

    if (!permissionState.servicesEnabled) {
      return { isRegistered: false, status: "unavailable" };
    }

    if (permissionState.foreground !== "granted" || permissionState.background !== "granted") {
      return { isRegistered: false, status: "blocked" };
    }

    await Location.startLocationUpdatesAsync(
      LOCATION_TRACKING_TASK_NAME,
      DEFAULT_LOCATION_TRACKING_OPTIONS,
    );

    return { isRegistered: true, status: "tracking" };
  },

  async stop(): Promise<LocationTrackingState> {
    const isAvailable = await TaskManager.isAvailableAsync();

    if (!isAvailable) {
      return { isRegistered: false, status: "unavailable" };
    }

    const { hasStartedLocationUpdates, isTaskRegistered } = await getLocationRegistrationState();

    if (!hasStartedLocationUpdates && !isTaskRegistered) {
      return { isRegistered: false, status: "idle" };
    }

    if (hasStartedLocationUpdates) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK_NAME);
    } else {
      await TaskManager.unregisterTaskAsync(LOCATION_TRACKING_TASK_NAME);
    }

    return { isRegistered: false, status: "idle" };
  },

  async getCurrentLocation() {
    const permissionState = await LocationPermissionService.getPermissionState();

    if (!permissionState.servicesEnabled) {
      throw new LocationTrackingError(
        "SERVICES_DISABLED",
        "Os serviços de localização do dispositivo estão desativados.",
      );
    }

    if (permissionState.foreground !== "granted") {
      throw new LocationTrackingError(
        "PERMISSION_DENIED",
        "Permita a localização enquanto usa o app para obter a posição atual.",
      );
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
    });

    return userLocationMapper.toEntity(location);
  },
};

async function getLocationRegistrationState(): Promise<{
  readonly hasStartedLocationUpdates: boolean;
  readonly isTaskRegistered: boolean;
}> {
  const [isTaskRegistered, hasStartedLocationUpdates] = await Promise.all([
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING_TASK_NAME),
    Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING_TASK_NAME),
  ]);

  return { hasStartedLocationUpdates, isTaskRegistered };
}

export { LocationTrackingService };
