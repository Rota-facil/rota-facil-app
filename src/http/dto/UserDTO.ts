import type { PrefecturesEntity } from "@/core/entity/prefectureEntity";
import type { UserRole } from "@/core/entity/userEntity";

interface UserDTO {
  id: string;
  name: string;
  email: string;
  cpf: string;
  role: UserRole;
  completedTrips: GLfloat;
  score: GLfloat;
  prefecture: PrefecturesEntity;
  active: boolean;
}

export type { UserDTO };
