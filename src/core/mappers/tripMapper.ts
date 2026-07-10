import type {
  SimpleTripUserEntity,
  TripBusEntity,
  TripDriverEntity,
  TripEntity,
  TripLocationEntity,
  TripPageEntity,
  TripPageResultEntity,
  TripRouteEntity,
  TripStatusEntity,
  TripUserEntity,
  TripUserUserEntity,
} from "@/core/entity/tripEntity";
import type {
  SimpleTripUserResponseDTO,
  TripBusResponseDTO,
  TripDriverResponseDTO,
  TripPageResponseDTO,
  TripResponseDTO,
  TripRouteBoardPointResponseDTO,
  TripRouteInstitutionResponseDTO,
  TripRouteResponseDTO,
  TripStatusResponseDTO,
  TripUserBoardPointResponseDTO,
  TripUserInstitutionResponseDTO,
  TripUserResponseDTO,
  TripUserUserResponseDTO,
} from "@/http/dto/tripDTO";

const tripMapper = {
  toUserEntity(dto: TripUserUserResponseDTO): TripUserUserEntity {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
    };
  },

  toLocationEntity(
    dto:
      | TripUserInstitutionResponseDTO
      | TripUserBoardPointResponseDTO
      | TripRouteInstitutionResponseDTO
      | TripRouteBoardPointResponseDTO,
  ): TripLocationEntity {
    return {
      id: dto.id,
      name: dto.name,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };
  },

  toTripUserEntity(dto: TripUserResponseDTO): TripUserEntity {
    return {
      id: dto.id,
      user: this.toUserEntity(dto.user),
      institution: this.toLocationEntity(dto.institution),
      boardPoint: this.toLocationEntity(dto.boardPoint),
      presence: dto.presence,
      going: dto.going,
      returning: dto.return_,
    };
  },

  toSimpleTripUserEntity(dto: SimpleTripUserResponseDTO): SimpleTripUserEntity {
    return {
      id: dto.id,
      user: this.toUserEntity(dto.user),
      institutionName: dto.institutionName,
      boardPointName: dto.boardPointName,
      presence: dto.presence,
      score: dto.score,
      going: dto.going,
      returning: dto.return_,
    };
  },

  toSimpleTripUserEntityList(dtos: SimpleTripUserResponseDTO[]): SimpleTripUserEntity[] {
    return dtos.map((dto) => this.toSimpleTripUserEntity(dto));
  },

  toDriverEntity(dto: TripDriverResponseDTO): TripDriverEntity {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
    };
  },

  toBusEntity(dto: TripBusResponseDTO): TripBusEntity {
    return {
      id: dto.id,
      driver: this.toDriverEntity(dto.driver),
      prefectureId: dto.prefectureId,
      capacity: dto.capacity,
      plate: dto.plate,
    };
  },

  toRouteEntity(dto: TripRouteResponseDTO): TripRouteEntity {
    return {
      id: dto.id,
      name: dto.name,
      shift: dto.shift,
      going: dto.going,
      returning: dto.return_,
      goingFinish: dto.goingFinish,
      returnFinish: dto.returnFinish,
      institutions: dto.institutions.map((institution) => this.toLocationEntity(institution)),
      boardPoints: dto.boardPoints.map((boardPoint) => this.toLocationEntity(boardPoint)),
    };
  },

  toStatusEntity(dto: TripStatusResponseDTO): TripStatusEntity {
    return {
      id: dto.id,
      progress: dto.progress,
      delay: dto.delay,
      description: dto.description,
      createdAt: dto.createdAt,
    };
  },

  toEntity(dto: TripResponseDTO): TripEntity {
    return {
      id: dto.id,
      name: dto.name,
      reasonOfCancellation: dto.reasonOfCancellation,
      students: dto.students,
      latitude: dto.latitude,
      longitude: dto.longitude,
      createdAt: dto.createdAt,
      bus: this.toBusEntity(dto.bus),
      route: this.toRouteEntity(dto.route),
      actualStatus: dto.actualStatus,
      tripStatus: dto.tripStatus.map((status) => this.toStatusEntity(status)),
    };
  },

  toEntityList(dtos: TripResponseDTO[]): TripEntity[] {
    return dtos.map((dto) => this.toEntity(dto));
  },

  toPageEntity(dto: TripPageResponseDTO): TripPageResultEntity {
    return {
      content: dto.content.map((trip) => this.toEntity(trip)),
      page: this.toPageInfoEntity(dto),
    };
  },

  toPageInfoEntity(dto: TripPageResponseDTO): TripPageEntity {
    return {
      size: dto.page.size,
      number: dto.page.number,
      totalElements: dto.page.totalElements,
      totalPages: dto.page.totalPages,
    };
  },
};

export { tripMapper };
