import type { LocationBatchEntity } from "@/core/entity/userLocationEntity";

interface LocationBatchSink {
  deliver(batch: LocationBatchEntity): Promise<void>;
}

const noopLocationBatchSink: LocationBatchSink = {
  async deliver() {
    // Future location synchronization will replace this sink without changing the native task.
  },
};

export type { LocationBatchSink };
export { noopLocationBatchSink };
