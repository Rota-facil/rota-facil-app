import type { PrefecturesEntity } from "./prefectureEntity";

type UserRole = "STUDENT" | "DRIVER";

interface BaseUserEntity {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly cpf: string;
  readonly role: UserRole;
  readonly completedTrips: number;
  readonly score: number;
  readonly prefecture: PrefecturesEntity;
  readonly active: boolean;
}

interface UserEntity extends BaseUserEntity {
  readonly createdAt: string;
}

export type { BaseUserEntity, UserEntity, UserRole };
