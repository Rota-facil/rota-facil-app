import { HttpClientError } from "@/errors/errors";
import type { CreateUserDTO, CreateUserResponseDTO } from "@/http/dto/createUserDTO";
import type {
  CompleteGoogleRegistrationRequestDTO,
  LoginDTO,
  LoginResponseDTO,
} from "@/http/dto/loginDTO";
import { AuthRequest } from "@/http/request/authRequest";
import { type GoogleLoginResult, parseGoogleOAuthCallback } from "./googleOAuthService";
import { STORAGE_KEYS, StorageService } from "./storageService";

const AuthService = {
  async register(credentials: CreateUserDTO): Promise<CreateUserResponseDTO> {
    const dto = await AuthRequest.register(credentials);

    await StorageService.save<string>(STORAGE_KEYS.AUTH_TOKEN, dto.accessToken);
    await StorageService.save<boolean>(STORAGE_KEYS.FIRST_ACCESS, false);

    return dto;
  },

  async login(credentials: LoginDTO): Promise<LoginResponseDTO> {
    const dto = await AuthRequest.login(credentials);

    await StorageService.save<string>(STORAGE_KEYS.AUTH_TOKEN, dto.accessToken);
    await StorageService.save<boolean>(STORAGE_KEYS.FIRST_ACCESS, false);

    return dto;
  },

  getGoogleStudentAuthUrl(): string {
    const authUrl = AuthRequest.getGoogleStudentAuthUrl();

    if (!authUrl.startsWith("http")) {
      throw new HttpClientError("URL da API não configurada para login Google.");
    }

    return authUrl;
  },

  async google(callbackUrl: string): Promise<GoogleLoginResult> {
    const result = parseGoogleOAuthCallback(callbackUrl);

    if (result.type === "authenticated") {
      await StorageService.save<string>(STORAGE_KEYS.AUTH_TOKEN, result.accessToken);
      await StorageService.save<boolean>(STORAGE_KEYS.FIRST_ACCESS, false);
    }

    return result;
  },

  async completeGoogleRegistration(
    pendingToken: string,
    data: CompleteGoogleRegistrationRequestDTO,
  ): Promise<LoginResponseDTO> {
    const dto = await AuthRequest.completeGoogleRegistration(pendingToken, data);

    await StorageService.save<string>(STORAGE_KEYS.AUTH_TOKEN, dto.accessToken);
    await StorageService.save<boolean>(STORAGE_KEYS.FIRST_ACCESS, false);

    return dto;
  },

  async logout(): Promise<void> {
    try {
      const token = await StorageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        await AuthRequest.logout(token);
      }
    } finally {
      await StorageService.clear();
    }
  },

  async clearLocalSession(): Promise<void> {
    await StorageService.clear();
  },
};

export { AuthService };
