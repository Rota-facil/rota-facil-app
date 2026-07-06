import { PrefectureRequest } from "@/http/request/prefectureRequest";
import type { PrefectureEntity } from "../entity/prefectureEntity";
import { Mapper } from "../mappers/mappers";

const PrefectureService = {
  async getPrefectures(): Promise<PrefectureEntity[]> {
    const dtos = await PrefectureRequest.getPrefectures();

    return Mapper.prefecture.toEntityList(dtos);
  },

  async getPrefecture(prefectureId: string): Promise<PrefectureEntity> {
    const dto = await PrefectureRequest.getPrefecture(prefectureId);

    return Mapper.prefecture.toEntity(dto);
  },
};

export { PrefectureService };
