import type { UserDTO } from "@/http/dto/UserDTO";
import type { AuthSession } from "../entity/AuthSession";
import { userMapper } from "./userMapper";

export const authMapper = {
  toEntity(accessToken: string, userDTO: UserDTO): AuthSession {
    return {
      accessToken: accessToken,
      user: userMapper.toEntity(userDTO),
    };
  },
};
