import { SoftError } from "@/errors/errors";
import { PrefectureRequest } from "@/http/request/prefectureRequest";
import type { PrefectureEntity } from "../entity/prefectureEntity";
import { Mapper } from "../mappers/mappers";
import { STORAGE_KEYS, StorageService } from "./storageService";

const PrefectureService = {
  async getPrefectures(): Promise<PrefectureEntity[]> {
    const accessToken = await this.getAccessToken();
    const dtos = await PrefectureRequest.getPrefectures(accessToken);

    return Mapper.prefecture.toEntityList(dtos);
  },

  async getPrefecture(prefectureId: string): Promise<PrefectureEntity> {
    const accessToken = await this.getAccessToken();
    const dto = await PrefectureRequest.getPrefecture(accessToken, prefectureId);

    return Mapper.prefecture.toEntity(dto);
  },

  async getAccessToken(): Promise<string> {
    const accessToken = await StorageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);

    if (!accessToken) {
      throw new SoftError("Sessão não encontrada. Faça login novamente.");
    }

    return accessToken;
  },
};

export { PrefectureService };
