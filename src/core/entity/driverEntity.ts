import type { BaseUserEntity } from "./userEntity";

type DriverStatus = "ON_ROUTE" | "AVAILABLE";
type DriverBusStatus = "OPERATION" | "OUT_OF_OPERATION";

interface DriverBusEntity {
  readonly id: string;
  readonly prefectureId: string;
  readonly capacity: number;
  readonly plate: string;
  readonly status: DriverBusStatus;
}

interface DriverEntity extends BaseUserEntity {
  readonly role: "DRIVER";
  readonly prefectureId: string;
  readonly bus: DriverBusEntity;
  readonly trips: number;
  readonly status: DriverStatus;
}

export type { DriverBusEntity, DriverBusStatus, DriverEntity, DriverStatus };
