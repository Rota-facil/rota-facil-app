import type { UserRole } from "./userEntity";

type BusStatus = string;

interface BusDriverEntity {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface BusEntity {
  id: string;
  prefectureId: string;
  capacity: number;
  plate: string;
  createdAt: string;
  driver: BusDriverEntity;
  status: BusStatus;
}

export type { BusDriverEntity, BusEntity, BusStatus };
