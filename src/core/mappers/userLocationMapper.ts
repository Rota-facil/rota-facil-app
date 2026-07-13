import type { LocationObject } from "expo-location";
import type { UserLocationEntity } from "@/core/entity/userLocationEntity";

const userLocationMapper = {
  toEntity(location: LocationObject): UserLocationEntity | null {
    const { coords, timestamp } = location;
    const userLocation: UserLocationEntity = {
      accuracy: normalizeOptionalNumber(coords.accuracy),
      altitude: normalizeOptionalNumber(coords.altitude),
      heading: normalizeOptionalNumber(coords.heading),
      latitude: coords.latitude,
      longitude: coords.longitude,
      speed: normalizeOptionalNumber(coords.speed),
      timestamp,
    };

    if (!isValidUserLocation(userLocation)) {
      return null;
    }

    return userLocation;
  },
};

function normalizeOptionalNumber(value: number | null): number | null {
  if (value === null) {
    return null;
  }

  return Number.isFinite(value) ? value : null;
}

function isValidUserLocation(location: UserLocationEntity): boolean {
  return (
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    Number.isFinite(location.timestamp) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
}

export { isValidUserLocation, userLocationMapper };
