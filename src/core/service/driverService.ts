import type { DriverEntity } from "@/core/entity/driverEntity";
import { Mapper } from "@/core/mappers/mappers";
import { DriverRequest } from "@/http/request/driverRequest";
import { PrefectureService } from "./prefectureService";
import { getRequiredAccessToken } from "./sessionTokenService";

const DriverService = {
  async me(): Promise<DriverEntity> {
    const token = await getRequiredAccessToken();
    const dto = await DriverRequest.me(token);
    const prefecture = await PrefectureService.getPrefecture(dto.prefectureId);

    return Mapper.driver.toEntity(dto, prefecture);
  },
};

export { DriverService };
