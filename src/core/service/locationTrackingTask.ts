import type { LocationObject } from "expo-location";
import * as TaskManager from "expo-task-manager";
import { BackgroundError } from "@/errors/errors";
import { handleError } from "@/errors/handleError";
import { LocationBatchProcessor } from "./locationBatchProcessor";
import { LOCATION_TRACKING_TASK_NAME } from "./locationTaskConfig";

interface LocationTrackingTaskData {
  readonly locations?: LocationObject[];
}

if (!TaskManager.isTaskDefined(LOCATION_TRACKING_TASK_NAME)) {
  TaskManager.defineTask<LocationTrackingTaskData>(
    LOCATION_TRACKING_TASK_NAME,
    async ({ data, error }) => {
      if (error) {
        handleError(new BackgroundError(`Falha na task de localização: ${error.message}`));
        return;
      }

      await LocationBatchProcessor.process(data?.locations, { receivedAt: Date.now() });
    },
  );
}
