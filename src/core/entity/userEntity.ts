import type { PrefecturesEntity } from "./prefectureEntity";

type UserRole = "STUDENT" | "DRIVER";

interface UserEntity {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  completedTrips: number;
  score: number;
  prefecture: PrefecturesEntity;
  active: boolean;
  createdAt: string;
}

export type { UserEntity, UserRole };
