import type { UserEntity } from "@/core/entity/userEntity";
import { Mapper } from "@/core/mappers/mappers";
import type { UpdateAccountRequestDTO } from "@/http/dto/UserDTO";
import { UserRequest } from "@/http/request/userRequest";
import { getRequiredAccessToken } from "./sessionTokenService";
import { StorageService } from "./storageService";

const UserService = {
  async me(): Promise<UserEntity> {
    const token = await getRequiredAccessToken();
    const dto = await UserRequest.me(token);

    return Mapper.user.toEntity(dto);
  },

  async update(payload: UpdateAccountRequestDTO): Promise<UserEntity> {
    const token = await getRequiredAccessToken();
    const dto = await UserRequest.update(token, payload);

    return Mapper.user.toEntity(dto);
  },

  async deleteAccount(): Promise<void> {
    const token = await getRequiredAccessToken();

    await UserRequest.deleteAccount(token);
    await StorageService.clear();
  },
};

export { UserService };
