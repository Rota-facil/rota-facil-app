import type { DriverResponseDTO } from "../dto/driverDTO";
import { httpClient } from "../httpClient/httpClient";

const DriverRequest = {
  async me(accessToken: string): Promise<DriverResponseDTO> {
    return httpClient.get<DriverResponseDTO>("/transports/users/drivers/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export { DriverRequest };
