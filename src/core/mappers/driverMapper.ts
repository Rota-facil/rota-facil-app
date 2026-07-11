import type { DriverBusEntity, DriverEntity } from "@/core/entity/driverEntity";
import type { PrefectureEntity } from "@/core/entity/prefectureEntity";
import type { DriverBusResponseDTO, DriverResponseDTO } from "@/http/dto/driverDTO";

const driverMapper = {
  toBusEntity(dto: DriverBusResponseDTO): DriverBusEntity {
    return {
      id: dto.id,
      prefectureId: dto.prefectureId,
      capacity: dto.capacity,
      plate: dto.plate,
      status: dto.status,
    };
  },

  toEntity(dto: DriverResponseDTO, prefecture: PrefectureEntity): DriverEntity {
    return {
      id: dto.id,
      prefectureId: dto.prefectureId,
      name: dto.name,
      email: dto.email,
      cpf: dto.cpf,
      role: dto.role,
      completedTrips: dto.completedTrips,
      trips: dto.trips,
      score: dto.score,
      prefecture,
      active: dto.active,
      status: dto.status,
      bus: this.toBusEntity(dto.bus),
    };
  },
};

export { driverMapper };
