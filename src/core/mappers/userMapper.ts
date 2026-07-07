import type { UserDTO } from "@/http/dto/UserDTO";
import type { UserEntity } from "../entity/userEntity";
import { prefectureMapper } from "./prefectureMapper";

const userMapper = {
  toEntity(dto: UserDTO): UserEntity {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      cpf: dto.cpf,
      role: dto.role,
      completedTrips: dto.completedTrips,
      score: dto.score,
      prefecture: prefectureMapper.toEntity(dto.prefecture),
      active: dto.active,
      createdAt: dto.createdAt,
    };
  },

  toEntityList(dtos: UserDTO[]): UserEntity[] {
    return dtos.map(this.toEntity);
  },
};

export { userMapper };
