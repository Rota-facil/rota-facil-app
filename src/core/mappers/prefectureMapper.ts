import { HttpClientError } from "@/errors/errors";
import type { PrefectureResponseDTO } from "@/http/dto/prefectureDTO";
import type { PrefectureEntity } from "../entity/prefectureEntity";

function normalizeRegion(region: string): string {
  if (!region) {
    throw new HttpClientError("Resposta de prefeitura inválida: campo [region] ausente ou vazio.");
  }

  return region.toLowerCase();
}

const prefectureMapper = {
  toEntity(dto: PrefectureResponseDTO): PrefectureEntity {
    return {
      id: dto.id,
      name: dto.name,
      region: normalizeRegion(dto.region),
    };
  },

  toEntityList(dtos: PrefectureResponseDTO[]): PrefectureEntity[] {
    return dtos.map((dto) => this.toEntity(dto));
  },
};

export { prefectureMapper };
