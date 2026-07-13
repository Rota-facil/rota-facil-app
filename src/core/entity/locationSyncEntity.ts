import type { UserLocationEntity } from "@/core/entity/userLocationEntity";

interface PendingLocationSyncItem {
  readonly attempts: number;
  readonly enqueuedAt: number;
  readonly id: string;
  readonly location: UserLocationEntity;
  readonly tripId: string;
}

type LocationSyncResultStatus = "synced" | "queued" | "skipped" | "failed";

type LocationSyncSkipReason = "missing-active-trip" | "empty-batch";

interface LocationSyncResult {
  readonly pendingItems: number;
  readonly reason?: LocationSyncSkipReason;
  readonly status: LocationSyncResultStatus;
}

export type {
  LocationSyncResult,
  LocationSyncResultStatus,
  LocationSyncSkipReason,
  PendingLocationSyncItem,
};
