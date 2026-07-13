import type { TripEntity, TripProgress } from "@/core/entity/tripEntity";
import { LocationTrackingService } from "./locationTrackingService";
import { STORAGE_KEYS, StorageService } from "./storageService";

const ACTIVE_LOCATION_SYNC_PROGRESS: ReadonlySet<TripProgress> = new Set([
  "STARTED",
  "RETURN_STARTED",
  "INSTITUTION_ARRIVAL",
  "BOARD_POINT_ARRIVAL",
]);

const LocationSyncActiveTripService = {
  async getActiveTripId(): Promise<string | null> {
    return StorageService.get<string>(STORAGE_KEYS.LOCATION_SYNC_ACTIVE_TRIP_ID);
  },

  async setActiveTripId(tripId: string): Promise<void> {
    const normalizedTripId = tripId.trim();

    if (normalizedTripId.length === 0) {
      return;
    }

    await StorageService.save(STORAGE_KEYS.LOCATION_SYNC_ACTIVE_TRIP_ID, normalizedTripId);
  },

  async clearActiveTripId(): Promise<void> {
    await StorageService.remove(STORAGE_KEYS.LOCATION_SYNC_ACTIVE_TRIP_ID);
  },

  async updateFromTrip(trip: TripEntity): Promise<void> {
    if (isLocationSyncActiveTrip(trip)) {
      await this.setActiveTripId(trip.id);
      return;
    }

    const activeTripId = await this.getActiveTripId();

    if (activeTripId === trip.id) {
      await this.clearActiveTripId();
      await LocationTrackingService.stop();
    }
  },
};

function getCurrentTripProgress(trip: TripEntity): TripProgress {
  return trip.tripStatus.at(-1)?.progress ?? "NOT_STARTED";
}

function isLocationSyncActiveTrip(trip: TripEntity): boolean {
  return ACTIVE_LOCATION_SYNC_PROGRESS.has(getCurrentTripProgress(trip));
}

export { isLocationSyncActiveTrip, LocationSyncActiveTripService };
