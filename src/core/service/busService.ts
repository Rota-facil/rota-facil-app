import type { BusEntity } from "@/core/entity/BusEntity";
import { Mapper } from "@/core/mappers/mappers";
import { BusRequest } from "@/http/request/busRequest";
import { getRequiredAccessToken } from "./sessionTokenService";

const BusService = {
  async getBus(busId: string): Promise<BusEntity> {
    const token = await getRequiredAccessToken();
    const dto = await BusRequest.getBus(token, busId);

    return Mapper.bus.toEntity(dto);
  },
};

export { BusService };
