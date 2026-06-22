import type { UserEntity } from "./userEntity";

interface BusEntity {
  id: string;
  prefectureId: string;
  capacity: GLfloat;
  plate: string;
  driver: UserEntity;
}

export type { BusEntity };
