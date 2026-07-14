import type { CreateUserDTO, CreateUserResponseDTO } from "../dto/createUserDTO";
import type {
  CompleteGoogleRegistrationRequestDTO,
  LoginDTO,
  LoginResponseDTO,
} from "../dto/loginDTO";
import { config } from "../httpClient/config";
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

  getGoogleStudentAuthUrl(): string {
    return `${config.apiBaseUrl}/auth/oauth2/authorization/google-student`;
  },

  async completeGoogleRegistration(
    pendingToken: string,
    payload: CompleteGoogleRegistrationRequestDTO,
  ): Promise<LoginResponseDTO> {
    return httpClient.post<LoginResponseDTO>(
      `/auth/google/complete-registration?pendingToken=${encodeURIComponent(pendingToken)}`,
      payload,
    );
  },

  async logout(accessToken: string): Promise<void> {
    return httpClient.post<void>("/auth/logout", undefined, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};
