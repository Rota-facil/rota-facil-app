import type { PendingLocationSyncItem } from "@/core/entity/locationSyncEntity";
import type { UserLocationEntity } from "@/core/entity/userLocationEntity";
import { isValidUserLocation } from "@/core/mappers/userLocationMapper";
import { LOCATION_SYNC_QUEUE_LIMIT } from "./locationSyncConfig";
import { STORAGE_KEYS, StorageService } from "./storageService";

const LocationSyncQueueService = {
  async getQueue(): Promise<PendingLocationSyncItem[]> {
    let storedQueue: unknown;

    try {
      storedQueue = await StorageService.get<unknown>(STORAGE_KEYS.LOCATION_SYNC_QUEUE);
    } catch {
      await this.clear();
      return [];
    }

    if (!Array.isArray(storedQueue)) {
      if (storedQueue !== null) {
        await this.clear();
      }

      return [];
    }

    const queue = storedQueue.filter(isPendingLocationSyncItem);

    if (queue.length !== storedQueue.length) {
      await this.replaceQueue(queue);
    }

    return queue;
  },

  async enqueue(items: readonly PendingLocationSyncItem[]): Promise<PendingLocationSyncItem[]> {
    if (items.length === 0) {
      return this.getQueue();
    }

    const queue = await this.getQueue();
    const existingIds = new Set(queue.map((item) => item.id));
    const uniqueItems = items.filter((item) => !existingIds.has(item.id));
    const nextQueue = trimQueue([...queue, ...uniqueItems]);

    await this.replaceQueue(nextQueue);

    return nextQueue;
  },

  async replaceQueue(queue: readonly PendingLocationSyncItem[]): Promise<void> {
    await StorageService.save(STORAGE_KEYS.LOCATION_SYNC_QUEUE, trimQueue(queue));
  },

  async reconcileProcessedItems(
    processedItemIds: ReadonlySet<string>,
    remainingProcessedItems: readonly PendingLocationSyncItem[],
  ): Promise<PendingLocationSyncItem[]> {
    const currentQueue = await this.getQueue();
    const untouchedItems = currentQueue.filter((item) => !processedItemIds.has(item.id));
    const nextQueue = trimQueue([...remainingProcessedItems, ...untouchedItems]);

    await this.replaceQueue(nextQueue);

    return nextQueue;
  },

  async clear(): Promise<void> {
    await StorageService.remove(STORAGE_KEYS.LOCATION_SYNC_QUEUE);
  },
};

function createPendingLocationSyncItem(
  tripId: string,
  location: UserLocationEntity,
  enqueuedAt: number,
): PendingLocationSyncItem {
  return {
    attempts: 0,
    enqueuedAt,
    id: createPendingLocationSyncItemId(tripId, location),
    location,
    tripId,
  };
}

function createPendingLocationSyncItemId(tripId: string, location: UserLocationEntity): string {
  return `${tripId}:${location.timestamp}:${location.latitude}:${location.longitude}`;
}

function trimQueue(queue: readonly PendingLocationSyncItem[]): PendingLocationSyncItem[] {
  if (queue.length <= LOCATION_SYNC_QUEUE_LIMIT) {
    return [...queue];
  }

  return queue.slice(queue.length - LOCATION_SYNC_QUEUE_LIMIT);
}

function isPendingLocationSyncItem(value: unknown): value is PendingLocationSyncItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.tripId === "string" &&
    value.tripId.trim().length > 0 &&
    typeof value.attempts === "number" &&
    Number.isInteger(value.attempts) &&
    value.attempts >= 0 &&
    typeof value.enqueuedAt === "number" &&
    Number.isFinite(value.enqueuedAt) &&
    isUserLocationEntity(value.location)
  );
}

function isUserLocationEntity(value: unknown): value is UserLocationEntity {
  if (!isRecord(value)) {
    return false;
  }

  const location = {
    accuracy: toNullableNumber(value.accuracy),
    altitude: toNullableNumber(value.altitude),
    heading: toNullableNumber(value.heading),
    latitude: value.latitude,
    longitude: value.longitude,
    speed: toNullableNumber(value.speed),
    timestamp: value.timestamp,
  };

  if (
    typeof location.latitude !== "number" ||
    typeof location.longitude !== "number" ||
    typeof location.timestamp !== "number"
  ) {
    return false;
  }

  return isValidUserLocation({
    ...location,
    latitude: location.latitude,
    longitude: location.longitude,
    timestamp: location.timestamp,
  });
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export { createPendingLocationSyncItem, LocationSyncQueueService };
