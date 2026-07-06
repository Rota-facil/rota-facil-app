import type { UserDTO } from "../dto/UserDTO";
import { httpClient } from "../httpClient/httpClient";

/**
 * Service responsável por gerenciar o crud do usuário.
 */
export const UserRequest = {
  async me(accesToken: string): Promise<UserDTO> {
    return httpClient.get<UserDTO>("/auth/me", {
      headers: { Authorization: `Bearer ${accesToken}` },
    });
  },
};
