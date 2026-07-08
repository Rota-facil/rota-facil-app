import type { BusDriverEntity, BusEntity } from "@/core/entity/BusEntity";
import type { BusDriverResponseDTO, BusResponseDTO } from "@/http/dto/busDTO";

const busMapper = {
  toDriverEntity(dto: BusDriverResponseDTO): BusDriverEntity {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      role: dto.role,
    };
  },

  toEntity(dto: BusResponseDTO): BusEntity {
    return {
      id: dto.id,
      prefectureId: dto.prefectureId,
      capacity: dto.capacity,
      plate: dto.plate,
      createdAt: dto.createdAt,
      driver: this.toDriverEntity(dto.driver),
      status: dto.status,
    };
  },
};

export { busMapper };
