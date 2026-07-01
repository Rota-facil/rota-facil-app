import type { UserDTO } from "@/http/dto/UserDTO";
import type { UserEntity } from "../entity/userEntity";

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
      prefecture: dto.prefecture,
    };
  },

  toEntityList(dtos: UserDTO[]): UserEntity[] {
    return dtos.map(this.toEntity);
  },
};

export { userMapper };
