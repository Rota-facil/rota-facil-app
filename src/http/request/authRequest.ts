import type { CreateUserDTO, CreateUserResponseDTO } from "../dto/createUserDTO";
import type { LoginDTO, LoginResponseDTO } from "../dto/loginDTO";
import { httpClient } from "../httpClient/httpClient";

/**
 * Service responsável por gerenciar a autenticação do usuário.
 */
export const AuthRequest = {
  async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
    return httpClient.post<LoginResponseDTO>("/auth/user/login", credentials);
  },

  async register(credentials: CreateUserDTO): Promise<CreateUserResponseDTO> {
    return httpClient.post<CreateUserResponseDTO>("/auth/register", credentials);
  },

  async googleAuth(): Promise<void> {},

  async logout(accessToken: string): Promise<void> {
    return httpClient.post<void>("/auth/logout", undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
