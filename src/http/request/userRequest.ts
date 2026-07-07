import type { UpdateAccountRequestDTO, UserDTO } from "../dto/UserDTO";
import { httpClient } from "../httpClient/httpClient";

/**
 * Service responsável por gerenciar o crud do usuário.
 */
export const UserRequest = {
  async me(accessToken: string): Promise<UserDTO> {
    return httpClient.get<UserDTO>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async update(accessToken: string, payload: UpdateAccountRequestDTO): Promise<UserDTO> {
    return httpClient.put<UserDTO>("/auth/update", payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async deleteAccount(accessToken: string): Promise<void> {
    return httpClient.delete<void>("/auth", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
