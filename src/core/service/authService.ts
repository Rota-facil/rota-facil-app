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
    // Back end api in changes

    // const token: string | null = await StorageService.get(
    //   STORAGE_KEYS.AUTH_TOKEN,
    // );

    // if (token) {
    //   try {
    //     await AuthRequest.deactivate(token);
    //   } catch (e) {
    //     handleError(e);
    //   }
    // }

    await StorageService.clear();
  },
};

export { AuthService };
