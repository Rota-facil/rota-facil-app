import type { LocationObject } from "expo-location";
import type { LocationBatchEntity, UserLocationEntity } from "@/core/entity/userLocationEntity";
import { userLocationMapper } from "@/core/mappers/userLocationMapper";
import { BackgroundError } from "@/errors/errors";
import { handleError } from "@/errors/handleError";
import type { LocationBatchSink } from "./locationBatchSink";
import { noopLocationBatchSink } from "./locationBatchSink";

interface ProcessLocationBatchOptions {
  readonly receivedAt?: number;
  readonly sink?: LocationBatchSink;
}

const LocationBatchProcessor = {
  async process(
    locations: readonly LocationObject[] | null | undefined,
    options: ProcessLocationBatchOptions = {},
  ): Promise<LocationBatchEntity | null> {
    if (!locations || locations.length === 0) {
      return null;
    }

    const mappedLocations = deduplicateLocations(
      locations
        .map((location) => userLocationMapper.toEntity(location))
        .filter((location): location is UserLocationEntity => location !== null),
    );

    if (mappedLocations.length === 0) {
      return null;
    }

    const batch: LocationBatchEntity = {
      locations: mappedLocations,
      receivedAt: options.receivedAt ?? Date.now(),
    };

    try {
      await (options.sink ?? noopLocationBatchSink).deliver(batch);
    } catch (error: unknown) {
      handleError(new BackgroundError(getBatchDeliveryErrorMessage(error)));
    }

    return batch;
  },
};

function deduplicateLocations(locations: readonly UserLocationEntity[]): UserLocationEntity[] {
  const seenKeys = new Set<string>();

  return locations.filter((location) => {
    const key = `${location.latitude}:${location.longitude}:${location.timestamp}`;

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);
    return true;
  });
}

function getBatchDeliveryErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return `Falha ao entregar lote de localização: ${error.message}`;
  }

  return "Falha ao entregar lote de localização.";
}

export { deduplicateLocations, LocationBatchProcessor };
