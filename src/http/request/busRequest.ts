import type { BusResponseDTO } from "../dto/busDTO";
import { httpClient } from "../httpClient/httpClient";

const BusRequest = {
  async getBus(accessToken: string, busId: string): Promise<BusResponseDTO> {
    return httpClient.get<BusResponseDTO>(`/transports/bus/${busId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export { BusRequest };
