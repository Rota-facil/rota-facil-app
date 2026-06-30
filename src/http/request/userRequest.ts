import { CreateUserDTO, CreateUserResponseDTO } from "../dto/createUserDTO";
import { LoginDTO, LoginResponseDTO } from "../dto/loginDTO";
import type { UserDTO } from "../dto/UserDTO";
import { httpClient } from "../httpClient/httpClient";

/**
 * Service responsável por gerenciar o crud do usuário.
 */
export const UserRequest = {
  async me(accesToken: string): Promise<UserDTO> {
    return httpClient.get<UserDTO>("/auth/me", {
      headers: { Autorization: `Bearer ${accesToken}` },
    });
  },
};
