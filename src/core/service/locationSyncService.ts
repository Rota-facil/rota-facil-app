import type { LocationSyncResult, PendingLocationSyncItem } from "@/core/entity/locationSyncEntity";
import type { LocationBatchEntity } from "@/core/entity/userLocationEntity";
import { BackgroundError, HttpClientError, HttpServerError, SoftError } from "@/errors/errors";
import { handleError } from "@/errors/handleError";
import { LocationSyncActiveTripService } from "./locationSyncActiveTripService";
import {
  LOCATION_SYNC_FLUSH_BATCH_LIMIT,
  LOCATION_SYNC_MAX_ATTEMPTS_PER_ITEM,
} from "./locationSyncConfig";
import {
  createPendingLocationSyncItem,
  LocationSyncQueueService,
} from "./locationSyncQueueService";
import { TripService } from "./tripService";

let isFlushingQueue = false;

const LocationSyncService = {
  async syncBatch(batch: LocationBatchEntity): Promise<LocationSyncResult> {
    if (batch.locations.length === 0) {
      return { pendingItems: 0, reason: "empty-batch", status: "skipped" };
    }

    const activeTripId = await LocationSyncActiveTripService.getActiveTripId();

    if (!activeTripId) {
      const queue = await LocationSyncQueueService.getQueue();

      return {
        pendingItems: queue.length,
        reason: "missing-active-trip",
        status: "skipped",
      };
    }

    const items = batch.locations.map((location) =>
      createPendingLocationSyncItem(activeTripId, location, batch.receivedAt),
    );
    const queue = await LocationSyncQueueService.enqueue(items);
    const flushResult = await this.flushPendingQueue();

    if (flushResult.status === "synced") {
      return flushResult;
    }

    return { pendingItems: queue.length, status: "queued" };
  },

  async flushPendingQueue(): Promise<LocationSyncResult> {
    if (isFlushingQueue) {
      const queue = await LocationSyncQueueService.getQueue();

      return { pendingItems: queue.length, status: "queued" };
    }

    isFlushingQueue = true;

    try {
      const queue = await LocationSyncQueueService.getQueue();

      if (queue.length === 0) {
        return { pendingItems: 0, status: "synced" };
      }

      const itemsToProcess = queue.slice(0, LOCATION_SYNC_FLUSH_BATCH_LIMIT);
      const processedItemIds = new Set(itemsToProcess.map((item) => item.id));
      const remainingProcessedItems: PendingLocationSyncItem[] = [];

      for (const item of itemsToProcess) {
        const result = await syncQueueItem(item);

        if (result === "synced" || result === "discarded") {
          continue;
        }

        remainingProcessedItems.push(result);
      }

      const nextQueue = await LocationSyncQueueService.reconcileProcessedItems(
        processedItemIds,
        remainingProcessedItems,
      );

      return {
        pendingItems: nextQueue.length,
        status: nextQueue.length === 0 ? "synced" : "queued",
      };
    } finally {
      isFlushingQueue = false;
    }
  },

  async getPendingQueue(): Promise<PendingLocationSyncItem[]> {
    return LocationSyncQueueService.getQueue();
  },
};

async function syncQueueItem(
  item: PendingLocationSyncItem,
): Promise<"synced" | "discarded" | PendingLocationSyncItem> {
  const activeTripId = await LocationSyncActiveTripService.getActiveTripId();

  if (activeTripId !== item.tripId) {
    return "discarded";
  }

  if (item.attempts >= LOCATION_SYNC_MAX_ATTEMPTS_PER_ITEM) {
    handleError(new BackgroundError("Localização pendente descartada após limite de tentativas."));
    return "discarded";
  }

  try {
    await TripService.processTripPosition({
      latitude: item.location.latitude,
      longitude: item.location.longitude,
      tripId: item.tripId,
    });

    return "synced";
  } catch (error: unknown) {
    if (isMissingSessionError(error)) {
      return item;
    }

    if (isRecoverableSyncError(error)) {
      return { ...item, attempts: item.attempts + 1 };
    }

    handleError(new BackgroundError("Localização pendente descartada por falha permanente."));
    return "discarded";
  }
}

function isMissingSessionError(error: unknown): boolean {
  return error instanceof SoftError;
}

function isRecoverableSyncError(error: unknown): boolean {
  if (error instanceof HttpClientError) {
    return true;
  }

  if (error instanceof HttpServerError) {
    return error.status === 408 || error.status === 429 || error.status >= 500;
  }

  return false;
}

export { LocationSyncService };
