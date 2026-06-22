import type { PrefecturesEntity } from "./prefectureEntity";

enum UserRole {
  STUDENT,
  DRIVER,
}

interface UserEntity {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  completedTrips: GLfloat;
  score: GLfloat;
  prefecture: PrefecturesEntity;
}

export type { UserEntity };
