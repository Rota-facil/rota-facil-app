import { SoftError } from "@/errors/errors";
import { STORAGE_KEYS, StorageService } from "./storageService";

async function getRequiredAccessToken(): Promise<string> {
  const token = await StorageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);

  if (!token) {
    throw new SoftError("Sessão expirada. Faça login novamente.");
  }

  return token;
}

export { getRequiredAccessToken };
