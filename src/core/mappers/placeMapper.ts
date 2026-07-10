import type {
  BoardPointEntity,
  BoardPointPageResultEntity,
  InstitutionEntity,
  InstitutionPageResultEntity,
  PlacePageEntity,
} from "@/core/entity/placeEntity";
import type {
  BoardPointPageResponseDTO,
  BoardPointResponseDTO,
  InstitutionPageResponseDTO,
  InstitutionResponseDTO,
  PlacePageDTO,
} from "@/http/dto/placeDTO";

const placeMapper = {
  toBoardPointEntity(dto: BoardPointResponseDTO): BoardPointEntity {
    return {
      id: dto.id,
      name: dto.name,
      latitude: dto.latitude,
      longitude: dto.longitude,
      createdAt: dto.createdAt,
    };
  },

  toInstitutionEntity(dto: InstitutionResponseDTO): InstitutionEntity {
    return {
      id: dto.id,
      name: dto.name,
      latitude: dto.latitude,
      longitude: dto.longitude,
      createdAt: dto.createdAt,
    };
  },

  toBoardPointPageEntity(dto: BoardPointPageResponseDTO): BoardPointPageResultEntity {
    return {
      content: dto.content.map((boardPoint) => this.toBoardPointEntity(boardPoint)),
      page: this.toPageEntity(dto.page),
    };
  },

  toInstitutionPageEntity(dto: InstitutionPageResponseDTO): InstitutionPageResultEntity {
    return {
      content: dto.content.map((institution) => this.toInstitutionEntity(institution)),
      page: this.toPageEntity(dto.page),
    };
  },

  toPageEntity(dto: PlacePageDTO): PlacePageEntity {
    return {
      size: dto.size,
      number: dto.number,
      totalElements: dto.totalElements,
      totalPages: dto.totalPages,
    };
  },
};

export { placeMapper };
