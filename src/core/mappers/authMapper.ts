import type { UserDTO } from "@/http/dto/UserDTO";
import type { AuthSession } from "../entity/AuthSession";

export const authMapper = {
  toEntity(accessToken: string, userDTO: UserDTO): AuthSession {
    return {
      accessToken: accessToken,
      user: {
        id: userDTO.id,
        name: userDTO.name,
        email: userDTO.email,
        cpf: userDTO.cpf,
        role: userDTO.role,
        completedTrips: userDTO.completedTrips,
        score: userDTO.score,
        prefecture: userDTO.prefecture,
      },
    };
  },
};
