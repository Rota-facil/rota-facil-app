import type { CreateUserDTO, CreateUserResponseDTO } from "@/http/dto/createUserDTO";
import type { LoginDTO, LoginResponseDTO } from "@/http/dto/loginDTO";
import { AuthRequest } from "@/http/request/authRequest";
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

  async google(): Promise<void> {
    throw new Error("Google Auth ainda não implementado");
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
