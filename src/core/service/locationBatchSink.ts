import type { LocationBatchEntity } from "@/core/entity/userLocationEntity";
import { LocationSyncService } from "./locationSyncService";

interface LocationBatchSink {
  deliver(batch: LocationBatchEntity): Promise<void>;
}

const locationSyncBatchSink: LocationBatchSink = {
  async deliver(batch: LocationBatchEntity) {
    await LocationSyncService.syncBatch(batch);
  },
};

export type { LocationBatchSink };
export { locationSyncBatchSink };
