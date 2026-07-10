import type {
  BoardPointPageResultEntity,
  InstitutionPageResultEntity,
  PlaceListParams,
} from "@/core/entity/placeEntity";
import { Mapper } from "@/core/mappers/mappers";
import { PlaceRequest } from "@/http/request/placeRequest";
import { getRequiredAccessToken } from "./sessionTokenService";

/**
 * Serviço de locais.
 * Orquestra token e conversão das listas paginadas de instituições e pontos de embarque.
 */
const PlaceService = {
  async getInstitutions(params?: PlaceListParams): Promise<InstitutionPageResultEntity> {
    const token = await getRequiredAccessToken();
    const dto = await PlaceRequest.getInstitutions(token, params);

    return Mapper.place.toInstitutionPageEntity(dto);
  },

  async getBoardPoints(params?: PlaceListParams): Promise<BoardPointPageResultEntity> {
    const token = await getRequiredAccessToken();
    const dto = await PlaceRequest.getBoardPoints(token, params);

    return Mapper.place.toBoardPointPageEntity(dto);
  },
};

export { PlaceService };
