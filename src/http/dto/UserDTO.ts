type UserRoleDTO = "STUDENT" | "DRIVER";

interface UserPrefectureResponseDTO {
  id: string;
  name: string;
  region: string;
}

interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  cpf: string;
  prefecture: UserPrefectureResponseDTO;
  active: boolean;
  completedTrips: number;
  score: number;
  role: UserRoleDTO;
  createdAt: string;
}

interface UpdateAccountRequestDTO {
  prefectureId: string;
  name: string;
  email: string;
  cpf: string;
}

type UserDTO = UserResponseDTO;

export type { UpdateAccountRequestDTO, UserDTO, UserPrefectureResponseDTO, UserResponseDTO };
